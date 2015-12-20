module.exports = function (gulp, $inject, orderSrc) {

  /**
   * Inject files in a sorted sequence at a specified inject label
   * @param   {Array} src   glob pattern for source files
   * @param   {String} label   The label name
   * @param   {Array} order   glob pattern for sort order of the files
   * @returns {Stream}   The stream
   */
  function _inject(src, label, orderPattern) {
      var options = {read: false};
      if (label) {
          options.name = 'inject:' + label;
      }

      return $inject(orderSrc(src, orderPattern), options);
  }

  return _inject;

};
