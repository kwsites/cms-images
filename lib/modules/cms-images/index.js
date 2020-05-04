module.exports = {

   improve: 'apostrophe-images',

   showTagFilter: { name: 'tags' },

   construct (self, options) {

      const showTagFilter = options.showTagFilter;
      if (showTagFilter !== false) {
         options.addFilters = [(typeof showTagFilter === 'object' && showTagFilter || { name: 'tags' })]
            .concat(options.addFilters || []);
      }
   },

};
