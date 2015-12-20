module.exports = function (gulp, imagemin, log, config) {

    gulp.task('images', ['clean-images'], function() {

        /**
         * Compress images
         * @return {Stream}
         */

        log('Compressing and copying images');

        return gulp
            .src(config.images)
            .pipe(imagemin({optimizationLevel: 4}))
            .pipe(gulp.dest(config.build + 'images'));
    });
};