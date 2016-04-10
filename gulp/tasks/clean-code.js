module.exports = function (gulp, config, clean) {

    gulp.task('clean-code', function(done) {
        /**
         * Remove all js and html from the build and temp folders
         * @param  {Function} done - callback when complete
         */
        var files = [].concat(
            config.temp + '**/*.js',
            config.build + 'js/**/*.js',
            config.build + '**/*.html'
        );
        clean(files, done);
    });
};