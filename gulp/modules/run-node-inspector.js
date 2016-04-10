module.exports = function (log) {

  function runNodeInspector() {
      log('Running node-inspector.');
      log('Browse to http://localhost:8080/debug?port=5858');
      var exec = require('child_process').exec;
      exec('node-inspector');
  }

  return runNodeInspector;

};
