
module.exports = (self, options) => {

   return {

      /**
       * Gets the number of items per row to keep the gallery looking neat - used when there could be a variable
       * number of items in the gallery. Set the `galleryItemsPerRow` option of the module to use a preferred
       * column count.
       */
      galleryItemsPerRow (source) {
         const divisions = [
            options.galleryItemsPerRow,
            ...options.galleryItemsPerRowSupported,
         ];

         for (let i = 0; i < divisions.length; i++) {
            if (! (source.length % divisions[i])) {
               return divisions[i];
            }
         }

         return divisions[0];
      },

      /**
       * Generates the necessary CSS background position for the supplied relationship - used when the image
       * widget is configured to support a focal point.
       */
      focalPoint (relationship) {
         if (!self.apos.attachments.hasFocalPoint(relationship)) {
            return '';
         }

         return `; background-position: ${ self.apos.attachments.focalPointToBackgroundPosition(relationship) }`;
      }

   }

};
