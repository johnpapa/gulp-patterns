module.exports = function (gulp, args, browserSync, config, changeEvent, log) {

    /**
     * Start BrowserSync
     * --nosync will avoid browserSync
     */
    function startBrowserSync(isDev, specRunner) {
        if (args.nosync || browserSync.active) {
            return;
        }
        var port = process.env.PORT || config.defaultPort;

        log('Starting BrowserSync on port ' + port);

        // If build: watches the files, builds, and restarts browser-sync.
        // If dev: watches less, compiles it to css, browser-sync handles reload
        if (isDev) {
            gulp.watch([config.less], ['styles'])
                .on('change', changeEvent);
        } else {
            gulp.watch([config.less, config.js, config.html], ['browserSyncReload'])
                .on('change', changeEvent);
        }

        var options = {
            proxy: 'localhost:' + port,
            port: 3000,
            files: isDev ? [
                config.client + '**/*.*',
                '!' + config.less,
                config.temp + '**/*.css'
            ] : [],
            ghostMode: { // these are the defaults t,f,t,t
                clicks: true,
                location: false,
                forms: true,
                scroll: true
            },
            injectChanges: true,
            logFileChanges: true,
            logLevel: 'debug',
            logPrefix: 'gulp-patterns',
            notify: true,
            reloadDelay: 0 //1000
        } ;
        if (specRunner) {
            options.startPath = config.specRunnerFile;
        }

        browserSync(options);
    }

    return startBrowserSync;


};
