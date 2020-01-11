const _ = require('lodash');

module.exports = (self, options) => {

   const {enableLayoutClassName = true} = options;

   self.getWidgetWrapperClasses = _.wrap(self.getWidgetWrapperClasses, (fn, widget) => {
      const classes = typeof fn === 'function' && fn(widget) || [];

      if (enableLayoutClassName && widget.layout) {
         classes.push(`${ self.piecesModuleName }-layout-${ widget.layout }`);
      }

      return classes;
   });

};
