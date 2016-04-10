module.exports = function (gulp, $if, order) {
  /**
   * Order a stream
   * @param   {Stream} src   The gulp.src stream
   * @param   {Array} order Glob array pattern
   * @returns {Stream} The ordered stream
   */
  function orderSrc (src, orderPattern) {

      //order = order || ['**/*'];
      return gulp
          .src(src)
          .pipe($if(orderPattern, order(orderPattern)));
  }

  return orderSrc;

};