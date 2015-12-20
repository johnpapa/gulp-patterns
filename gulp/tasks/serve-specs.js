module.exports = function (gulp, serve, log) {
    gulp.task('serve-specs', ['build-specs'], function(done) {
        /**
         * Run the spec runner
         * @return {Stream}
         */
        log('run the spec runner');
        serve(true /* isDev */, true /* specRunner */);
        done();
    });
};