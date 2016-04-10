module.exports = function (_) {

  var path = require('path');

  /**
   * Show OS level notification using node-notifier
   */
  function notify(options) {
      var notifier = require('node-notifier');
      var notifyOptions = {
          sound: 'Bottle',
          contentImage: path.join(__dirname, 'gulp.png'),
          icon: path.join(__dirname, 'gulp.png')
      };
      _.assign(notifyOptions, options);
      notifier.notify(notifyOptions);
  }

  return notify;

};
