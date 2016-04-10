module.exports = function (gulp, config, args, injectFile, log, wiredep) {

    gulp.task('build-specs', ['templatecache'], function(done) {
        /**
         * Inject all the spec files into the specs.html
         * @return {Stream}
         */
        log('building the spec runner');

        var templateCache = config.temp + config.templateCache.file;
        var options = config.getWiredepDefaultOptions();
        var specs = config.specs;

        if (args.startServers) {
            specs = [].concat(specs, config.serverIntegrationSpecs);
        }
        options.devDependencies = true;

        return gulp
            .src(config.specRunner)
            .pipe(wiredep.stream(options))
            .pipe(injectFile(config.js, '', config.jsOrder))
            .pipe(injectFile(config.testlibraries, 'testlibraries'))
            .pipe(injectFile(config.specHelpers, 'spechelpers'))
            .pipe(injectFile(specs, 'specs', ['**/*']))
            .pipe(injectFile(templateCache, 'templates'))
            .pipe(gulp.dest(config.client));
    });
};
