const _ = require('lodash');

module.exports = {

   improve: 'apostrophe-images-widgets',

   addFields: [

      {
         type: 'select',
         name: 'layout',
         choices: [
            {
               value: '',
               label: 'Default',
            },
            {
               value: 'single',
               label: 'Inline Single',
               showFields: ['href', 'width'],
            },
         ]
      },

      {
         name: 'href',
         label: 'Link URL',
         type: 'string',
      },

      {
         type: 'select',
         name: 'width',
         label: 'Width',
         choices: [
            {value: '', label: 'Default'},
            {
               value: 'fill',
               label: 'Full',
            },
         ]
      }

   ],

   construct (self, options) {

      applyDefaults(options, {
         galleryItemsPerRow: 4,
         galleryItemsPerRowSupported: [5, 6, 3],
      });

      self.apos.templates.addFilter(require('./lib/filters')(self, options));

      self.getEditPermissionName = () => 'edit-' + self.name.replace(/s$/, '');

      self.load = _.wrap(self.load, function (superFn, req, widgets, callback) {
         const editable = self.apos.permissions.can(req, self.getEditPermissionName());
         widgets.forEach(widget => widget._editable = editable);

         superFn(req, widgets, callback);
      });

      self.route('post', 'set-focal-point', auth, piece, (req, res) => {

         const db = self.apos.docs.db;
         const {relationship, imageId, doc, path, widget, piece} = req.body;

         const itemIndex = piece[path].items.findIndex(_.matchesProperty('_id', widget));
         const relationships = piece[path].items[itemIndex].relationships;

         if (!relationships[imageId]) {
            return res.send({ok: false, err: 'Unknown image'});
         }

         if (!isPercent(relationship.x) || !isPercent(relationship.y)) {
            return res.send({ok: false, err: 'Bad data format'});
         }

         relationships[imageId].x = relationship.x;
         relationships[imageId].y = relationship.y;

         const route = `${ path }.items.$.relationships`;
         db.update({_id: doc, [`${ path }.items._id`]: widget}, {$set: {[route]: relationships}}, (err) => {
            res.send({
               ok: !err,
               err: err
            });
         });

      });

      self.route('post', 'set-image-order', auth, piece, (req, res) => {

         const db = self.apos.docs.db;
         const {order, doc, path, widget, piece} = req.body;

         const itemIndex = piece[path].items.findIndex(_.matchesProperty('_id', widget));
         const currentOrder = piece[path].items[itemIndex].pieceIds;

         if (_.difference(order, currentOrder).length || currentOrder.length !== order.length) {
            return res.send({
               ok: false,
               err: 'One or more unknown items in new order'
            });
         }

         const route = `${ path }.items.$.pieceIds`;
         db.update({_id: doc, [`${ path }.items._id`]: widget}, {$set: {[route]: order}}, (err) => {
            res.send({
               ok: !err,
               err: err
            });
         });

      });

      function auth (req, res, next) {
         if (self.apos.permissions.can(req, self.getEditPermissionName())) {
            return next();
         }

         res.status(401).send({ok: false, err: 'Unauthorized'});
      }

      function piece (req, res, next) {
         const {doc, path, widget} = req.body;

         self.apos.docs.db.find({_id: doc, [`${ path }.items._id`]: widget}).toArray((err, detail) => {

            if (err || !detail || !detail.length) {
               next(new Error(err || 'Unknown page/widget'));
            }

            req.body.piece = detail[0];
            next();

         });
      }

   }

};

function isPercent (input) {
   return !isNaN(input) && input >= 0 && input <= 100;
}

function applyDefaults (options, defaults) {
   return _.reduce(defaults, (opt, value, key) => {
      if (!_.has(opt, key)) {
         opt[key] = value;
      }
      return opt;
   }, options);
}
