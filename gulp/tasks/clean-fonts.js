module.exports = function (gulp, config, clean) {

    gulp.task('clean-fonts', function(done) {
        /**
         * Remove all fonts from the build folder
         * @param  {Function} done - callback when complete
         */
        clean(config.build + 'fonts/**/*.*', done);
    });
};