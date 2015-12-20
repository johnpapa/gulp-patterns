module.exports = function (gulp, serve) {

    gulp.task('serve-dev', ['inject'], function() {
        /**
         * serve the dev environment
         * --debug-brk or --debug
         * --nosync
         */
        serve(true /*isDev*/);
    });
};