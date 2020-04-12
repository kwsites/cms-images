apos.define('apostrophe-images-widgets-editor', {

   construct: function (self, options) {

      self.beforeShow = _.wrap(self.beforeShow, function (beforeShow, callback) {

         _.each(_.get(options, 'templateOptions', {}), function (value, key) {
            if (!_.find(self.schema, _.matchesProperty('name', key))) {
               return;
            }

            self.$el.find('.apos-field[data-name="' + key + '"] :input').prop('disabled', true);
            self.data[key] = value;
         });

         beforeShow(callback);
      });


   }

});
