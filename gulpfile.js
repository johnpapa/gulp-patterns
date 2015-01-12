var args = require('yargs').argv;
var browserSync = require('browser-sync');
var config = require('./gulp.config')();
var del = require('del');
var glob = require('glob');
var gulp = require('gulp');
var path = require('path');
var _ = require('lodash');
var $ = require('gulp-load-plugins')({lazy: true});

var colors = $.util.colors;
var envenv = $.util.env;
var port = process.env.PORT || config.defaultPort;

/**
 * yargs variables can be passed in to alter the behavior, when present.
 * Example: gulp serve-dev
 *
 * --verbose  : Various tasks will produce more output to the console.
 * --nosync   : Don't launch the browser with browser-sync when serving code.
 * --debug    : Launch debugger with node-inspector.
 * --debug-brk: Launch debugger and break on 1st line with node-inspector.
 * --startServers: Will start servers for midway tests on the test task.
 */

var recipes = {};

recipes.test = gulp.series(vet, templatecache, function(done) {
    startTests(true /* singleRun */, done);
});

recipes.injectAll = gulp.series(gulp.parallel(injectBower, styles, templatecache),
                                injectCSS);

recipes.build = gulp.series(recipes.test,
                        gulp.parallel(images, fonts, recipes.injectAll),
                        gulp.series(optimize, buildCompleted));

/**
 * List the available gulp tasks
 */
//function taskListing() {
////    $.taskListing();
//}

/**
 * vet the code and create coverage report
 * @return {Stream}
 */
function vet() {
    log('Analyzing source with JSHint and JSCS');

    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe($.jshint.reporter('fail'))
        .pipe($.jscs());
}

/**
 * Create a visualizer report
 */
function plato(done) {
    log('Analyzing source with Plato');
    log('Browse to /report/plato/index.html to see Plato results');

    startPlatoVisualizer(done);
}

/**
 * Remove all files from the build, temp, and reports folders
 * @param  {Function} done - callback when complete
 */
function clean(done) {
    cleanFiles([].concat(
        config.build,
        config.temp,
        config.report
    ));
    done();
}

/**
 * Compile less to css
 * @return {Stream}
 */
function styles() {
    log('Compiling Less -- CSS');

    var files = [].concat(
        config.temp + '**/*.css',
        config.build + 'styles/**/*.css'
    );
    cleanFiles(files);

    return gulp
        .src(config.less)
        .pipe($.plumber()) // exit gracefully if something fails after this
        .pipe($.less())
//        .on('error', errorLogger) // more verbose and dupe output. requires emit.
        .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
        .pipe(gulp.dest(config.temp));
}

/**
 * Copy fonts
 * @return {Stream}
 */
function fonts() {
    log('Copyin fonts');

    cleanFiles(config.build + 'fonts/**/*.*');

    return gulp
        .src(config.fonts)
        .pipe(gulp.dest(config.build + 'fonts'));
}

/**
 * Compress images
 * @return {Stream}
 */
function images() {
    log('Compressing and copyin images');

    cleanFiles(config.build + 'images/**/*.*');

    return gulp
        .src(config.images)
        .pipe($.imagemin({optimizationLevel: 4}))
        .pipe(gulp.dest(config.build + 'images'));
}

function lessWatcher() {
    gulp.watch([config.less], styles);
}

/**
 * Create $templateCache from the html templates
 * @return {Stream}
 */
function templatecache() {
    log('Creating an AngularJS $templateCache');

    cleanFiles(config.temp + '**/*.js');

    return gulp
        .src(config.htmltemplates)
        .pipe($.if(args.verbose, $.bytediff.start()))
        .pipe($.minifyHtml({empty: true}))
        .pipe($.if(args.verbose, $.bytediff.stop(bytediffFormatter)))
        .pipe($.angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options
        ))
        .pipe(gulp.dest(config.temp));
}

/**
 * Wire-up the bower dependencies
 * @return {Stream}
 */
function injectBower() {
    log('Wiring the bower dependencies into the html');

    var wiredep = require('wiredep').stream;
    var options = config.getWiredepDefaultOptions();

    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.client));
}

/**
 * Inject all the spec files into the specs.html
 * @return {Stream}
 */
function buildSpecs(done) {
    log('building the spec runner');

    var wiredep = require('wiredep').stream;
    var templateCache = config.temp + config.templateCache.file;
    var options = config.getWiredepDefaultOptions();
    var specs = config.specs;

    if (args.startServers) {
        specs = [].concat(specs, config.serverIntegrationSpecs);
    }
    options.devDependencies = true;

    return gulp
        .src(config.specRunner)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.js)))
        .pipe($.inject(gulp.src(config.testlibraries),
            {name: 'inject:testlibraries', read: false}))
        .pipe($.inject(gulp.src(config.specHelpers),
            {name: 'inject:spechelpers', read: false}))
        .pipe($.inject(gulp.src(specs),
            {name: 'inject:specs', read: false}))
        .pipe($.inject(gulp.src(templateCache),
            {name: 'inject:templates', read: false}))
        .pipe(gulp.dest(config.client));
}

/**
 * Run the spec runner
 * @return {Stream}
 */
function serveSpecs (done) {
    log('run the spec runner');
    serve(true /* isDev */, true /* specRunner */);
    done();
}

/**
 * Run specs once and exit
 * To start servers and run midway specs as well:
 *    gulp test --startServers
 * @return {Stream}
 */
//var test = gulp.series(vet, templatecache, test, function() {
//    startTests(true /* singleRun */);
//});

/**
 * Run specs and wait.
 * Watch for file changes and re-run tests on each change
 * To start servers and run midway specs as well:
 *    gulp autotest --startServers
 */
function autotest(done) {
    startTests(false /* singleRun */, done);
}

/**
 * Optimize all files, move to a build folder,
 * and inject them into the new index.html
 * @return {Stream}
 */
function optimize() {
    log('Optimizing the js css, and html');

    var assets = $.useref.assets({searchPath: './'});
    // Filters are named for the gulp-useref path
    var cssFilter = $.filter('**/*.css');
    var jsAppFilter = $.filter('**/' + config.optimized.app);
    var jslibFilter = $.filter('**/' + config.optimized.lib);

    var templateCache = config.temp + config.templateCache.file;

    cleanFiles([].concat(
        config.build + 'js/**/*.js',
        config.build + '**/*.html'
    ));

    return gulp
        .src(config.index)
        .pipe($.plumber())
        .pipe($.inject(gulp.src(templateCache),
            {name: 'inject:templates', read: false}))
        .pipe(assets) // Gather all assets from the html with useref
        // Get the css
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        // Get the custom javascript
        .pipe(jsAppFilter)
        .pipe($.ngAnnotate({add: true}))
        .pipe($.uglify())
        .pipe(getHeader())
        .pipe(jsAppFilter.restore())
        // Get the vendor javascript
        .pipe(jslibFilter)
        .pipe($.uglify()) // another option is to override wiredep to use min files
        .pipe(jslibFilter.restore())
        // Take inventory of the file names for future rev numbers
        .pipe($.rev())
        // Apply the concat and file replacement with useref
        .pipe(assets.restore())
        .pipe($.useref())
        // Replace the file names in the html with rev numbers
        .pipe($.revReplace())
        .pipe(gulp.dest(config.build));
}

/**
 * serve the dev environment
 * --debug-brk or --debug
 * --nosync
 */
function serveDev(done) {
    serve(true /* isDev */, false /* specRunner */);
    done();
}

/**
 * serve the build environment
 * --debug-brk or --debug
 * --nosync
 */
function serveBuild(done) {
    serve(false /* isDev */, false /* specRunner */);
    done();
}

/**
 * Bump the version
 * --type=pre will bump the prerelease version *.*.*-x
 * --type=patch or no flag will bump the patch version *.*.x
 * --type=minor will bump the minor version *.x.*
 * --type=major will bump the major version x.*.*
 * --version=1.2.3 will bump to a specific version and ignore other flags
 */
function bump() {
    var msg = 'Bumping versions';
    var type = args.type;
    var version = args.ver;
    var options = {};
    if (version) {
        options.version = version;
        msg += ' to ' + version;
    } else {
        options.type = type;
        msg += ' for a ' + type;
    }
    log(msg);

    return gulp
        .src(config.packages)
        .pipe($.print())
        .pipe($.bump(options))
        .pipe(gulp.dest(config.root));
}

/**
 * When files change, log it
 * @param  {Object} event - event that fired
 */
function changeEvent(event) {
    var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
    log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

/**
 * Delete all files in a given path
 * @param  {Array}   path - array of paths to delete
 * @param  {Function} done - callback when complete
 */
function cleanFiles(path) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del.sync(path);
}

/**
 * serve the code
 * --debug-brk or --debug
 * --nosync
 * @param  {Boolean} isDev - dev or build mode
 * @param  {Boolean} specRunner - server spec runner html
 */
function serve(isDev, specRunner) {
    var debug = args.debug || args.debugBrk;
    var exec;
    var nodeOptions = {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'build'
        },
        watch: [config.server]
    };

    if (debug) {
        log('Running node-inspector. Browse to http://localhost:8080/debug?port=5858');
        exec = require('child_process').exec;
        exec('node-inspector');
        nodeOptions.nodeArgs = [debug + '=5858'];
    }

    return $.nodemon(nodeOptions)
        .on('restart', vet, function(ev) {
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

/**
 * Start BrowserSync
 * --nosync will avoid browserSync
 */
function startBrowserSync(isDev, specRunner) {
    if (args.nosync || browserSync.active) {
        return;
    }

    log('Starting BrowserSync on port ' + port);

    // If build: watches the files, builds, and restarts browser-sync.
    // If dev: watches less, compiles it to css, browser-sync handles reload
    if (isDev) {
        gulp.watch([config.less], styles)
            .on('change', changeEvent);
    } else {
        gulp.watch([config.less, config.js, config.html], [optimize, browserSync.reload])
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

/**
 * Start Plato inspector and visualizer
 */
function startPlatoVisualizer(done) {
    log('Running Plato');

    var files = glob.sync(config.plato.js);
    var excludeFiles = /.*\.spec\.js/;
    var plato = require('plato');

    var options = {
        title: 'Plato Inspections Report',
        exclude: excludeFiles
    };
    var outputDir = config.report + '/plato';

    plato.inspect(files, outputDir, options, platoCompleted);

    function platoCompleted(report) {
        var overview = plato.getOverviewReport(report);
        if (args.verbose) {
            log(overview.summary);
        }
        if (done) { done(); }
    }
}

/**
 * Start the tests using karma.
 * @param  {boolean} singleRun - True means run once and end (CI), or keep running (dev)
 * @param  {Function} done - Callback to fire when karma is done
 * @return {undefined}
 */
function startTests(singleRun, done) {
    var child;
    var excludeFiles = [];
    var fork = require('child_process').fork;
    var karma = require('karma').server;
    var serverSpecs = config.serverIntegrationSpecs;

    if (args.startServers) {
        log('Starting servers');
        var savedEnv = process.env;
        savedEnv.NODE_ENV = 'dev';
        savedEnv.PORT = 8888;
        child = fork(config.nodeServer);
    } else {
        if (serverSpecs && serverSpecs.length) {
            excludeFiles = serverSpecs;
        }
    }

    karma.start({
        configFile: __dirname + '/karma.conf.js',
        exclude: excludeFiles,
        singleRun: !!singleRun
    }, karmaCompleted);

    ////////////////

    function karmaCompleted(karmaResult) {
        log('Karma completed');
        if (child) {
            log('shutting down the child process');
            child.kill();
        }
        if (karmaResult === 1) {
            done('karma: tests failed with code ' + karmaResult);
        } else {
            done();
        }
    }
}

/**
 * Formatter for bytediff to display the size changes after processing
 * @param  {Object} data - byte data
 * @return {String}      Difference in bytes, formatted
 */
function bytediffFormatter(data) {
    var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
    return data.fileName + ' went from ' +
        (data.startSize / 1000).toFixed(2) + ' kB to ' +
        (data.endSize / 1000).toFixed(2) + ' kB and is ' +
        formatPercent(1 - data.percent, 2) + '%' + difference;
}

/**
 * Log an error message and emit the end of a task
 */
function errorLogger(error) {
    log('*** Start of Error ***');
    log(error);
    log('*** End of Error ***');
    this.emit('end');
}

/**
 * Format a number as a percentage
 * @param  {Number} num       Number to format as a percent
 * @param  {Number} precision Precision of the decimal
 * @return {String}           Formatted perentage
 */
function formatPercent(num, precision) {
    return (num * 100).toFixed(precision);
}

/**
 * Format and return the header for files
 * @return {String}           Formatted file header
 */
function getHeader() {
    var pkg = require('./package.json');
    var template = ['/**',
        ' * <%= pkg.name %> - <%= pkg.description %>',
        ' * @authors <%= pkg.authors %>',
        ' * @version v<%= pkg.version %>',
        ' * @link <%= pkg.homepage %>',
        ' * @license <%= pkg.license %>',
        ' */',
        ''
    ].join('\n');
    return $.header(template, {
        pkg: pkg
    });
}

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

/**
 * Show OS level notification using node-notifier
 */
function notify(options) {
    var notifier = require('node-notifier');
    var notifyOptions = {
        sound: 'Bottle',
        contentImage: path.join(__dirname, 'gulp.png'),
        icon: path.join(__dirname, 'gulp.png')
    };
    _.assign(notifyOptions, options);
    notifier.notify(notifyOptions);
}

function injectCSS() {
    log('Wire up css in the html, after files are ready');

    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.css)))
        .pipe(gulp.dest(config.client));
}

function buildCompleted(done) {
    log('Built everything');

    var msg = {
        title: 'gulp build',
        subtitle: 'Deployed to the build folder',
        message: 'Running `gulp serve-build`'
    };
    log(msg);
    notify(msg);
    done();
}

/**
 * Tasks
 */

// gulp-task-listing does not work in gulp 4
//gulp.task('help', gulp.parallel(help));
//gulp.task('default', taskListing);
// don't need these to be tasks anymore. embedded them
//gulp.task('clean-code' ...
//gulp.task('clean-fonts' ...
//gulp.task('clean-images' ...
//gulp.task('clean-styles' ...
gulp.task('vet', vet);
gulp.task('plato', plato);
gulp.task('clean', clean);
gulp.task('styles', styles);
//gulp.task('fonts', gulp.series(fonts));
//gulp.task('images', gulp.series(images));
gulp.task('less-watcher', lessWatcher);
//gulp.task('templatecache', gulp.series(templatecache));
gulp.task('inject-bower', injectBower);
//gulp.task('build-specs', gulp.series(templatecache, buildSpecs));
gulp.task('serve-specs', gulp.series(templatecache, buildSpecs, serveSpecs));
gulp.task('test', recipes.test);
gulp.task('autotest', gulp.series(templatecache, autotest));
gulp.task('build', recipes.build); //TODO: not really needed, just a nice gut check
gulp.task('serve-dev', gulp.series(recipes.injectAll, serveDev));
gulp.task('serve-build', gulp.series(recipes.build, serveBuild));
gulp.task('bump', bump);

module.exports = gulp;
