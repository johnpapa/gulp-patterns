module.exports = function (gulp, config, log, plumber, less, autoprefixer) {
    gulp.task('styles', ['clean-styles'], function() {
        /**
         * Compile less to css
         * @return {Stream}
         */
        log('Compiling Less --> CSS');

        return gulp
            .src(config.less)
            .pipe(plumber()) // exit gracefully if something fails after this
            .pipe(less())
    //        .on('error', errorLogger) // more verbose and dupe output. requires emit.
            .pipe(autoprefixer({browsers: ['last 2 version', '> 5%']}))
            .pipe(gulp.dest(config.temp));
    });

};