
apos.define('apostrophe-images-chooser', {

   extend: 'apostrophe-pieces-chooser',

   construct: function(self, options) {

      self.$el.addClass(self.__meta.name);

   }

});
