(function () {

   'use strict';

   var CONTAINER_CLASS = 'cms-image-gallery';
   var SLIDE_CLASS = 'cms-gallery-slide';
   var THUMB_CLASS = 'cms-gallery-thumbnail';
   var NEXT_SLIDE_CLASS = 'cms-gallery-next-slide';
   var PREVIOUS_SLIDE_CLASS = 'cms-gallery-previous-slide';
   var SLIDES_CONTAINER_CLASS = 'cms-gallery-slides';


   apos.define('apostrophe-images-widgets', {
      extend: 'apostrophe-pieces-widgets',
      construct: function(self, options) {

         self.play = function($widget, data, options) {
            var renderer = (data.pieceIds.length > 1 && options.multiRenderer) || options.renderer || 'gallery';
            var interval = options.interval || 3000;
            var container = $widget.find('.' + CONTAINER_CLASS);
            var slideParent = $widget.find('.' + SLIDES_CONTAINER_CLASS);

            switch (renderer) {
               case 'home':
                  homePagePlayer(container, slideParent, interval);
                  break;

               case 'default':
                  defaultPlayer(container, slideParent, interval);
                  break;

               case 'gallery':
                  galleryPlayer(container, slideParent);
            }

         };

      }
   });

   function galleryPlayer (container, slideParent) {
      var lightBox = container.find('.cms-gallery-lightbox');
      var images = container.find('.' + THUMB_CLASS);
      var currentImage;

      container.on('click', '.cms-gallery-thumbnail a', false);

      images.on('click', function () {
         showImage(images.index(this));
      });

      container.on('click','[data-action="play"]', function () {
         // slideshow
      });

      container.on('click', '[data-action="back"]', function () { return showNext(-1) });
      container.on('click', '[data-action="next"]', function () { showNext(1) });
      container.on('click', '[data-action="close"]', closeLightbox);

      function showNext (direction) {
         var index = currentImage + direction;
         if (index < 0) {
            index = images.length -1;
         }
         if (index >= images.length) {
            index = 0;
         }

         showImage(index);
      }

      function showImage (index) {
         currentImage = index;
         var imageData = images.eq(index).data();

         var img = new Image();
         img.src = imageData.fullImage;
         img.onload = function () {
            var image = jQuery(img).addClass('cms-gallery-next-image').data('imageId', imageData.imageId);

            lightBox.find('.cms-gallery-image img').addClass('cms-gallery-prev-image');
            lightBox.find('.cms-gallery-image').append(image);

            setTimeout(function () { image.removeClass('cms-gallery-next-image') }, 5);
         };

         lightBox
            .toggleClass('activated', true)
            .toggleClass('cms-lightbox-portrait', /true/.test(imageData.portrait));

         jQuery(document).off('.cms-gallery')
            .on('keydown.cms-gallery', function (e) {
               switch (e.which) {
                  case 39: showNext(1); return;
                  case 37: showNext(-1); return;
                  case 27: closeLightbox(); return;
               }
            });
      }

      function closeLightbox () {
         lightBox.toggleClass('activated');
         lightBox.find('.cms-gallery-image').empty();
         jQuery(document).off('.cms-gallery');
      }
   }

   function homePagePlayer (container, slideParent, interval) {
      var slides = container.find('.cms-gallery-slide');

      if (slides.length < 2) {
         return;
      }

      setInterval(
         function () {
            if (container.is('.paused')) {
               return;
            }

            goNext(slideParent);
         },
         interval);

      container.addClass('activated');

   }

   function defaultPlayer (container, slideParent, interval) {
      var slides = container.find('.cms-gallery-slide');

      if (slides.length < 2) {
         return;
      }

      var schedule = function (ref) {
         var intervalHandler = function () {
            if (!container.is('.paused')) {
               goNext(slideParent);
            }

            schedule();
         };
         return function () {
            clearTimeout(ref);
            ref = setTimeout(intervalHandler, interval);
         };
      }();
      schedule();

      container.find('[data-action="back"]').on('click', function () { goBack(slideParent); schedule(); });
      container.find('[data-action="next"]').on('click', function () { goNext(slideParent); schedule(); });

      container.addClass('activated');
   }

   function goBack (container) {
      var currentSlides = container.find('.' + SLIDE_CLASS);
      var prev = currentSlides.filter('.' + PREVIOUS_SLIDE_CLASS);

      if (!prev.length) {
         prev = currentSlides.last()
            .removeClass(NEXT_SLIDE_CLASS)
            .addClass(PREVIOUS_SLIDE_CLASS)
            .prependTo(container);

         currentSlides = container.find('.' + SLIDE_CLASS);
      }

      // remove markers from the newly active item
      prev.removeClass(PREVIOUS_SLIDE_CLASS).removeClass(NEXT_SLIDE_CLASS);

      // mark all others as being next
      prev.siblings().addClass(NEXT_SLIDE_CLASS);

      // move the final next item to the start and mark it as previous
      container.prepend(
         currentSlides.last().removeClass(NEXT_SLIDE_CLASS).addClass(PREVIOUS_SLIDE_CLASS)
      );

      return prev;
   }

   function goNext (container) {
      var currentSlides = container.find('.cms-gallery-slide');
      var prev = currentSlides.filter('.' + PREVIOUS_SLIDE_CLASS);

      container.append(
         prev
            .removeClass('cms-gallery-previous-slide')
            .addClass('cms-gallery-next-slide')
      );

      currentSlides = container.find('.cms-gallery-slide');

      currentSlides.filter('.' + SLIDE_CLASS + ':not(.' + PREVIOUS_SLIDE_CLASS + ')').eq(0)
         .addClass(PREVIOUS_SLIDE_CLASS);

      return currentSlides.filter('.' + NEXT_SLIDE_CLASS).eq(0)
         .removeClass(NEXT_SLIDE_CLASS);
   }

} ());
