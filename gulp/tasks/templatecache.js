module.exports = function (gulp, angularTemplatecache, bytediffFormatter, $if, minifyHtml, bytediff, args, config, log) {

    gulp.task('templatecache', ['clean-code'], function() {
        /**
         * Create $templateCache from the html templates
         * @return {Stream}
         */
        log('Creating an AngularJS $templateCache');

        return gulp
            .src(config.htmltemplates)
            .pipe($if(args.verbose, bytediff.start()))
            .pipe(minifyHtml({empty: true}))
            .pipe($if(args.verbose, bytediff.stop(bytediffFormatter)))
            .pipe(angularTemplatecache(
                config.templateCache.file,
                config.templateCache.options
            ))
            .pipe(gulp.dest(config.temp));
    });
};