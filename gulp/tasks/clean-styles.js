module.exports = function (gulp, config, clean) {

    gulp.task('clean-styles', function(done) {
        /**
         * Remove all styles from the build and temp folders
         * @param  {Function} done - callback when complete
         */
        var files = [].concat(
            config.temp + '**/*.css',
            config.build + 'styles/**/*.css'
        );
        clean(files, done);
    });
};