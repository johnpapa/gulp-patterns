module.exports = function (gulp, config, args, injectFile, log) {
    gulp.task('wiredep', function() {
        /**
         * Wire-up the bower dependencies
         * @return {Stream}
         */
        log('Wiring the bower dependencies into the html');

        var wiredep = require('wiredep').stream;
        var options = config.getWiredepDefaultOptions();

        // Only include stubs if flag is enabled
        var js = args.stubs ? [].concat(config.js, config.stubsjs) : config.js;
        return gulp
            .src(config.index)
            .pipe(wiredep(options))
            .pipe(injectFile(js, '', config.jsOrder))
            .pipe(gulp.dest(config.client));
    });
};
