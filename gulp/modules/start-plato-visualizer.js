module.exports = function (gulp, log, config, glob, args) {

  /**
   * Start Plato inspector and visualizer
   */
  function startPlatoVisualizer(done) {
      log('Running Plato');

      var files = glob.sync(config.plato.js);
      var excludeFiles = /.*\.spec\.js/;
      var plato = require('plato');

      var options = {
          title: 'Plato Inspections Report',
          exclude: excludeFiles
      };
      var outputDir = config.report + '/plato';

      plato.inspect(files, outputDir, options, platoCompleted);

      function platoCompleted(report) {
          var overview = plato.getOverviewReport(report);
          if (args.verbose) {
              log(overview.summary);
          }
          if (done) { done(); }
      }
  }

  return startPlatoVisualizer;

};


