module.exports = function (gulp, config, useref, filter, plumber, injectFile , csso,
    ngAnnotate, uglify, getHeader, rev, revReplace, log) {

    gulp.task('optimize', ['inject', 'test'], function() {
        /**
         * Optimize all files, move to a build folder,
         * and inject them into the new index.html
         * @return {Stream}
         */
        log('Optimizing the js, css, and html');

        var assets = useref.assets({searchPath: './'});
        // Filters are named for the gulp-useref path
        var cssFilter = filter('**/*.css');
        var jsAppFilter = filter('**/' + config.optimized.app);
        var jslibFilter = filter('**/' + config.optimized.lib);

        var templateCache = config.temp + config.templateCache.file;

        return gulp
            .src(config.index)
            .pipe(plumber())
            .pipe(injectFile(templateCache, 'templates'))
            .pipe(assets) // Gather all assets from the html with useref
            // Get the css
            .pipe(cssFilter)
            .pipe(csso())
            .pipe(cssFilter.restore())
            // Get the custom javascript
            .pipe(jsAppFilter)
            .pipe(ngAnnotate({add: true}))
            .pipe(uglify())
            .pipe(getHeader())
            .pipe(jsAppFilter.restore())
            // Get the vendor javascript
            .pipe(jslibFilter)
            .pipe(uglify()) // another option is to override wiredep to use min files
            .pipe(jslibFilter.restore())
            // Take inventory of the file names for future rev numbers
            .pipe(rev())
            // Apply the concat and file replacement with useref
            .pipe(assets.restore())
            .pipe(useref())
            // Replace the file names in the html with rev numbers
            .pipe(revReplace())
            .pipe(gulp.dest(config.build));
    });
};
