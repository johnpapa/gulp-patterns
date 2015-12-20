module.exports = function (gulp, config, util, log, del) {

    gulp.task('clean', function(done) {
        /**
         * Remove all files from the build, temp, and reports folders
         * @param  {Function} done - callback when complete
         */
        var delconfig = [].concat(config.build, config.temp, config.report);
        log('Cleaning: ' + util.colors.blue(delconfig));
        del(delconfig, done);
    });
};