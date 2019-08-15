(function (apos, jQuery, _) {

   'use strict';

   apos.define('apostrophe-images-widgets', {

      construct: function (self, options) {

         self.play = _.wrap(self.play, function (superPlay, $widget, data, options) {

            _.attempt(superPlay, $widget, data, options);

            var area = $widget.closest('.apos-area');
            var doc = area.attr('data-doc-id');
            var path = area.attr('data-dot-path');

            if (!(doc && path) || data.pieceIds.length < 2) {
               return;
            }

            $widget
               .find('.cms-gallery-slides')
               .sortable({
                  update: function (event, ui) {
                     var order = [].map.call($widget.find('.cms-gallery-thumbnail'), function (node) {
                        return node.dataset.imageId;
                     });

                     self.api(
                        'set-image-order',
                        {
                           order: order,
                           doc: doc,
                           path: path,
                           widget: data._id
                        },
                        function () { $widget.removeClass('updating') },
                        function () {  }
                     );
                  }
               });

            $widget.find('.cms-gallery-image').on('click', 'img', function (e) {
               if (localStorage.getItem('admin-focal-point-editor') !== 'true') {
                  return;
               }

               var image = jQuery(this).removeClass('updated').addClass('updating');
               var imageId = image.data('imageId');
               var relationship = data.relationships[imageId];

               relationship.x = 100 * e.offsetX / image.width();
               relationship.y = 100 * e.offsetY / image.height();

               self.api(
                  'set-focal-point',
                  {
                     relationship: relationship,
                     imageId: imageId,
                     doc: doc,
                     path: path,
                     widget: data._id
                  },
                  function () { image.removeClass('updating').addClass('updated'); },
                  function () { }
               );

            });

            $widget.find('[data-action="focal-point-editor"]')
               .click(function () {
                  localStorage.setItem('admin-focal-point-editor', this.checked);
               })
               .prop('checked', function () {
                  this.checked = localStorage.getItem('admin-focal-point-editor') === 'true';
               });

         }, self.play);

      }

   });

}(window.apos, jQuery, window._));
