module.exports = function (util, log, del) {

  /**
   * Delete all files in a given path
   * @param  {Array}   path - array of paths to delete
   * @param  {Function} done - callback when complete
   */
  function clean(path, done) {
      log('Cleaning: ' + util.colors.blue(path));
      del(path, done);
  }

  return clean;

};