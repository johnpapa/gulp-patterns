module.exports = function (util) {
  /**
   * Log a message or series of messages using chalk's blue color.
   * Can pass in a string, object or array.
   */
  function log(msg) {
      if (typeof(msg) === 'object') {
          for (var item in msg) {
              if (msg.hasOwnProperty(item)) {
                  util.log(util.colors.blue(msg[item]));
              }
          }
      } else {
          util.log(util.colors.blue(msg));
      }
  }

  return log;
};
