module.exports = function (gulp, log, config) {

    /**
     * Copy fonts
     * @return {Stream}
     */
    gulp.task('fonts', ['clean-fonts'], function() {
        log('Copying fonts');

        return gulp
            .src(config.fonts)
            .pipe(gulp.dest(config.build + 'fonts'));
    });

};