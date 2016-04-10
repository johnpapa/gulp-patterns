module.exports = function (gulp, browserSync) {
    gulp.task('browserSyncReload', ['optimize'], function () {
        /**
         * Optimize the code and re-load browserSync
         */
        browserSync.reload();
    });
    // gulp.task('browserSyncReload', ['optimize'], browserSync.reload);
};