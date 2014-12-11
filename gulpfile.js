/* jshint camelcase:false */
var gulp = require('gulp');
var browserSync = require('browser-sync');
var config = require('./gulp.config.json');
var del = require('del');
var glob = require('glob');
var _ = require('lodash');
var path = require('path');
var plug = require('gulp-load-plugins')();

var colors = plug.util.colors;
var env = plug.util.env;
var port = process.env.PORT || config.defaultPort;

/**
 * env variables can be passed in to alter the behavior, when present.
 * Example: gulp serve-dev --sync
 *
 * --verbose  : Various tasks will produce more output to the console.
 * --sync     : Launch the browser with browser-sync when serving code.
 * --debug    : Launch debugger with node-inspector.
 * --debug-brk: Launch debugger and break on 1st line with node-inspector.
 * --startServers: Will start servers for midway tests on the test task.
 */

/**
 * List the available gulp tasks
 */
gulp.task('help', plug.taskListing);
gulp.task('default', ['help'], plug.taskListing);

/**
 * Lint the code, create coverage report, and a visualizer
 * @return {Stream}
 */
gulp.task('analyze', function() {
    log('Analyzing source with JSHint, JSCS, and Plato');

    var merge = require('merge-stream');
    var jshint = analyzejshint(config.alljs);
    var jscs = analyzejscs(config.alljs);
    startPlatoVisualizer();

    return merge(jshint, jscs);
});

/**
 * Create $templateCache from the html templates
 * @return {Stream}
 */
gulp.task('templatecache', function() {
    log('Creating an AngularJS $templateCache');

    return gulp
        .src(config.htmltemplates)
        .pipe(plug.bytediff.start())
        .pipe(plug.minifyHtml({empty: true}))
        .pipe(plug.if(env.verbose, plug.bytediff.stop(bytediffFormatter)))
        .pipe(plug.angularTemplatecache(config.templateCache.file, {
            module: config.templateCache.module,
            standalone: false,
            root: config.templateCache.root
        }))
        .pipe(gulp.dest(config.temp));
});

/**
 * Wire-up the bower dependencies
 * @return {Stream}
 */
gulp.task('wiredep', function () {
    log('Wiring the bower dependencies into the html');

    var wiredep = require('wiredep').stream;
    
    return gulp
        .src(config.client + 'index.html')
        .pipe(wiredep({
            bowerJson: require('./bower.json'),
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        }))
        .pipe(gulp.dest(config.client));
});

/**
 * Copy fonts
 * @return {Stream}
 */
gulp.task('fonts', function() {
    log('Copying fonts');
    return gulp
        .src(config.fonts)
        .pipe(gulp.dest(config.build + 'fonts'));
});

/**
 * Compress images
 * @return {Stream}
 */
gulp.task('images', function() {
    var dest = config.build + 'content/images';
    log('Compressing, caching, and copying images');
    return gulp
        .src(config.images)
        .pipe(plug.imagemin({
            optimizationLevel: 3
        }))
        .pipe(gulp.dest(dest));
});

/**
 * Optimize all files, move to a build folder, 
 * and inject them into the new index.html
 * @return {Stream}
 */
gulp.task('build', ['templatecache', 'wiredep', 'images', 'fonts'], function(done) {
    log('Building the optimized app');

    var projectHeader = getHeader();

    var stream = gulp
        .src(config.client + 'index.html')
        .pipe(plug.inject(gulp.src(config.temp + config.templateCache.file, {read: false}), {
            starttag: '<!-- inject:templates:js -->',
        }))
        .pipe(plug.usemin({
            assetsDir: './',
            html: [plug.minifyHtml({empty: true})],
            css: [
                plug.autoprefixer('last 2 version', '> 5%'), 
                plug.minifyCss(), 
                'concat', 
                plug.rev(), 
                projectHeader
            ],
            css_libs: [plug.minifyCss(), 'concat', plug.rev()],
            js: [
                plug.ngAnnotate({add: true}), 
                plug.uglify(),
                'concat', 
                plug.rev(),
                projectHeader
            ],
            js_libs: [plug.uglify(), 'concat', plug.rev()]
        }))
//        .pipe(gulp.dest(config.build))
//        .pipe(plug.rev.manifest())
        .pipe(gulp.dest(config.build));

    stream.on('end', function() {
        var msg = {
            title: 'Gulp Build',
            subtitle: 'Deployed to the build folder',
            message: 'gulp serve-dev --sync'
        };
        del(config.temp);
        log(msg);
        notify(msg);
        done();
    });
    stream.on('error', function(err) {
        done(err);
    });
});

/**
 * Remove all files from the build folder
 * One way to run clean before all tasks is to run
 * from the cmd line: gulp clean && gulp build
 * @return {Stream}
 */
gulp.task('clean', function(done) {
    var delconfig = [].concat(config.build, config.temp, config.report);
    log('Cleaning: ' + plug.util.colors.blue(delconfig));
    del(delconfig, done);
});

/**
 * Run specs once and exit
 * To start servers and run midway specs as well:
 *    gulp test --startServers
 * @return {Stream}
 */
gulp.task('test', function(done) {
    startTests(true /*singleRun*/ , done);
});

/**
 * Run specs and wait.
 * Watch for file changes and re-run tests on each change
 * To start servers and run midway specs as well:
 *    gulp autotest --startServers
 */
gulp.task('autotest', function(done) {
    startTests(false /*singleRun*/ , done);
});

/**
 * serve the dev environment, with debug,
 * and with node inspector
 */
gulp.task('serve-dev-debug', function() {
    serve({
        mode: 'dev',
        debug: '--debug'
    });
});

/**
 * serve the dev environment, with debug-brk,
 * and with node inspector
 */
gulp.task('serve-dev-debug-brk', function() {
    serve({
        mode: 'dev',
        debug: '--debug-brk'
    });
});

/**
 * serve the dev environment
 */
gulp.task('serve-dev', function() {
    serve({mode: 'dev'});
});

/**
 * serve the build environment
 */
gulp.task('serve-build', function() {
    serve({mode: 'build'});
});

////////////////

/**
 * Execute JSHint on given source files
 * @param  {Array} sources
 * @param  {String} overrideRcFile
 * @return {Stream}
 */
function analyzejshint(sources, overrideRcFile) {
    var jshintrcFile = overrideRcFile || './.jshintrc';
    log('Running JSHint');
    return gulp
        .src(sources)
        .pipe(plug.if(env.verbose, plug.print()))
        .pipe(plug.jshint(jshintrcFile))
        .pipe(plug.jshint.reporter('jshint-stylish'));
}

/**
 * Execute JSCS on given source files
 * @param  {Array} sources
 * @return {Stream}
 */
function analyzejscs(sources) {
    log('Running JSCS');
    return gulp
        .src(sources)
        .pipe(plug.jscs('./.jscsrc'));
}

/**
 * Start the node server using nodemon.
 * Optionally start the node debugging.
 * @param  {Object} args - debugging arguments
 * @return {Stream}
 */
function serve(args) {
    var options = {
        script: config.server + 'app.js',
        delayTime: 1,
        env: {
            'NODE_ENV': args.mode,
            'PORT': port
        },
        watch: [config.server]
    };

    var exec;
    if (args.debug) {
        log('Running node-inspector. Browse to http://localhost:8080/debug?port=5858');
        exec = require('child_process').exec;
        exec('node-inspector');
        options.nodeArgs = [args.debug + '=5858'];
    }

    if (args.mode === 'build') {
        gulp.watch([config.css, config.js], ['build']);
    }

    return plug.nodemon(options)
        .on('start', function() {
            startBrowserSync();
        })
        //.on('change', tasks)
        .on('restart', function() {
            log('restarted!');
            setTimeout(function () {
                browserSync.reload({stream: false});
            }, 1000);
        });
}

/**
 * Start BrowserSync
 */
function startBrowserSync() {
    if (!env.sync || browserSync.active) {
        return;
    }

    log('Starting BrowserSync on port ' + port);
    browserSync({
        proxy: 'localhost:' + port,
        port: 3000,
        files: [config.client + '/**/*.*'],
        ghostMode: { // these are the defaults t,f,t,t
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        logLevel: 'debug',
        logPrefix: 'gulp-patterns',
        notify: true,
        reloadDelay: 1000
    });
}

/**
 * Start Plato inspector and visualizer
 */
function startPlatoVisualizer() {
    log('Running Plato');

    var files = glob.sync(config.appjs);
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
        if (env.verbose) {
            log(overview.summary);
        }
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

    if (env.startServers) {
        log('Starting servers');
        var savedEnv = process.env;
        savedEnv.NODE_ENV = 'dev';
        savedEnv.PORT = 8888;
        child = fork('src/server/app.js', childProcessCompleted);
    } else {
        excludeFiles.push('./src/client/test/midway/**/*.spec.js');
    }

    karma.start({
        configFile: __dirname + '/karma.conf.js',
        exclude: excludeFiles,
        singleRun: !!singleRun
    }, karmaCompleted);

    ////////////////

    function childProcessCompleted(error, stdout, stderr) {
        log('stdout: ' + stdout);
        log('stderr: ' + stderr);
        if (error !== null) {
            log('exec error: ' + error);
        }
    }

    function karmaCompleted() {
        if (child) {
            child.kill();
        }
        done();
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
        (data.startSize / 1000).toFixed(2) + ' kB to ' + (data.endSize / 1000).toFixed(2) + ' kB' +
        ' and is ' + formatPercent(1 - data.percent, 2) + '%' + difference;
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
        ''].join('\n');
    return plug.header(template, {pkg : pkg});
}

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {               
                plug.util.log(plug.util.colors.blue(msg[item]));
            }
        }
    } else {
        plug.util.log(plug.util.colors.blue(msg));
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
