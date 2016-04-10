module.exports = function (gulp, config, injectFile, log) {

    gulp.task('inject', ['wiredep', 'styles', 'templatecache'], function() {
        log('Wire up css into the html, after files are ready');

        return gulp
            .src(config.index)
            .pipe(injectFile(config.css))
            .pipe(gulp.dest(config.client));
    });
};
