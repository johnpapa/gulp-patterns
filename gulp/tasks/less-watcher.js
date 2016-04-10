module.exports = function (gulp, config) {

    gulp.task('less-watcher', function() {
        gulp.watch([config.less], ['styles']);
    });
};