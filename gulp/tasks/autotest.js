module.exports = function (gulp, startTests) {

    gulp.task('autotest', function(done) {
        /**
         * Run specs and wait.
         * Watch for file changes and re-run tests on each change
         * To start servers and run midway specs as well:
         *    gulp autotest --startServers
         */
        startTests(false /*singleRun*/ , done);
    });
};