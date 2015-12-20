module.exports = function (log, config) {
  /**
   * When files change, log it
   * @param  {Object} event - event that fired
   */
  function changeEvent(event) {
      var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
      log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
  }

  return changeEvent;

};
