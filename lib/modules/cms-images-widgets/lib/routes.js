const _ = require('lodash');

module.exports = (self, options) => {

   if (options.enableRouteFocalPoint) {
      self.route('post', 'set-focal-point', auth, piece, setFocalPoint);
   }

   if (options.enableRouteReorder) {
      self.route('post', 'set-image-order', auth, piece, setImageOrder);
   }

   function setFocalPoint(req, res) {

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

   }

   function setImageOrder (req, res) {

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

   }

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

};
