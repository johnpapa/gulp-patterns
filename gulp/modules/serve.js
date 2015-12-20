module.exports = function (args, getNodeOptions, nodemon, log, browserSync, runNodeInspector, config, startBrowserSync) {
    /**
     * serve the code
     * --debug-brk or --debug
     * --nosync
     * @param  {Boolean} isDev - dev or build mode
     * @param  {Boolean} specRunner - server spec runner html
     */
    function serve(isDev, specRunner) {
        var debug = args.debug || args.debugBrk;
        var debugMode = args.debug ? '--debug' : args.debugBrk ? '--debug-brk' : '';
        var nodeOptions = getNodeOptions(isDev);

        if (debug) {
            runNodeInspector();
            nodeOptions.nodeArgs = [debugMode + '=5858'];
        }

        if (args.verbose) {
            console.log(nodeOptions);
        }

        return nodemon(nodeOptions)
            .on('restart', ['vet'], function(ev) {
                log('*** nodemon restarted');
                log('files changed:\n' + ev);
                setTimeout(function() {
                    browserSync.notify('reloading now ...');
                    browserSync.reload({stream: false});
                }, config.browserReloadDelay);
            })
            .on('start', function () {
                log('*** nodemon started');
                startBrowserSync(isDev, specRunner);
            })
            .on('crash', function () {
                log('*** nodemon crashed: script crashed for some reason');
            })
            .on('exit', function () {
                log('*** nodemon exited cleanly');
            });
    }


    return serve;
};
