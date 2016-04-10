module.exports = function (gulp, log, del, notify, config) {

    gulp.task('build', ['optimize', 'images', 'fonts'], function() {
        /**
         * Build everything
         * This is separate so we can run tests on
         * optimize before handling image or fonts
         */
        log('Building everything');

        var msg = {
            title: 'gulp build',
            subtitle: 'Deployed to the build folder',
            message: 'Running `gulp serve-build`'
        };
        del(config.temp);
        log(msg);
        notify(msg);
    });
};