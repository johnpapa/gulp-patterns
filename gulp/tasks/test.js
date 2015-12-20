module.exports = function (gulp, startTests) {

    gulp.task('test', ['vet', 'templatecache'], function(done) {
        /**
         * Run specs once and exit
         * To start servers and run midway specs as well:
         *    gulp test --startServers
         * @return {Stream}
         */
        startTests(true /*singleRun*/ , done);
    });
};
