module.exports = function (gulp, startPlatoVisualizer, log) {

    gulp.task('plato', function(done) {
        /**
         * Create a visualizer report
         */
        log('Analyzing source with Plato');
        log('Browse to /report/plato/index.html to see Plato results');

        startPlatoVisualizer(done);
    });

};