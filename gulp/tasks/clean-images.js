module.exports = function (gulp, config, clean) {

    gulp.task('clean-images', function(done) {
        /**
         * Remove all images from the build folder
         * @param  {Function} done - callback when complete
         */
        clean(config.build + 'images/**/*.*', done);
    });
};