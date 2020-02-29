const _ = require('lodash');

module.exports = {

   improve: 'apostrophe-images-widgets',

   enableRouteReorder: true,

   enableRouteFocalPoint: true,

   enableLayoutClassName: true,

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
               showFields: ['href', 'width', 'size'],
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
         label: 'CSS image width',
         choices: [
            {value: '', label: 'Default'},
            {
               value: 'fill',
               label: 'Full',
            },
         ]
      },

      {
         type: 'select',
         name: 'size',
         label: 'Cropped image size',
         choices: [
            {value: '', label: 'Default'},
         ]
      },

   ],

   afterConstruct (self) {
      _.find(self.schema, _.matchesProperty('name', 'size')).choices.push(
         ...self.apos.attachments.imageSizes.map(({name}) => ({value: name, label: _.startCase(name)})),
      );
   },

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

      require('./lib/api')(self, options);
      require('./lib/routes')(self, options);

   }

};

function applyDefaults (options, defaults) {
   return _.reduce(defaults, (opt, value, key) => {
      if (!_.has(opt, key)) {
         opt[key] = value;
      }
      return opt;
   }, options);
}
