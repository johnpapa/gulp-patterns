module.exports = function (gulp, serve) {

    gulp.task('serve-build', ['build'], function() {
        /**
         * serve the build environment
         * --debug-brk or --debug
         * --nosync
         */
        serve(false /*isDev*/);
    });
};