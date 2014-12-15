var gulp = require('gulp');
var browserSync = require('browser-sync');
var config = require('./gulp.config')().getConfig();
var del = require('del');
var glob = require('glob');
var _ = require('lodash');
var path = require('path');
var plug = require('gulp-load-plugins')({lazy: true});

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
 * --prod     : building or serving prod(uction)
 * --startServers: Will start servers for midway tests on the test task.
 */

/**
 * List the available gulp tasks
 */
gulp.task('help', plug.taskListing);
gulp.task('default', ['help']);

/**
 * Lint the code, create coverage report, and a visualizer
 * @return {Stream}
 */
gulp.task('analyze', function() {
    log('Analyzing source with JSHint, JSCS, and Plato');

    startPlatoVisualizer();

    return gulp
        .src(config.alljs)
        .pipe(plug.if(env.verbose, plug.print()))
        .pipe(plug.jshint.reporter('jshint-stylish'))
        .pipe(plug.jscs());
});

/**
 * Create $templateCache from the html templates
 * @return {Stream}
 */
gulp.task('templatecache', ['clean-code'], function() {
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
gulp.task('wiredep', function() {
    log('Wiring the bower dependencies into the html');

    var wiredep = require('wiredep').stream;

    return gulp.src(config.client + 'index.html')
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
gulp.task('fonts', ['clean-fonts'], function() {
    log('Copying fonts');
    return gulp.src(config.fonts)
    .pipe(gulp.dest(config.build + 'fonts'));
});

/**
 * Compress images
 * @return {Stream}
 */
gulp.task('images', ['clean-images'], function() {
    var dest = config.build + 'images';
    log('Compressing, caching, and copying images');
    return gulp.src(config.images)
    .pipe(plug.imagemin({
        optimizationLevel: 3
    }))
    .pipe(gulp.dest(dest));
});

/**
 * Build everything
 */
gulp.task('build', ['html', 'images', 'fonts'], function() {
    log('Building everything');
});

/**
 * Optimize all files, move to a build folder,
 * and inject them into the new index.html
 * @return {Stream}
 */
gulp.task('html', ['templatecache', 'wiredep'], function(done) {
    log('Optimizing the js, css, and html');

    var assets = plug.useref.assets({searchPath: './'});
    // Filters are named for the gulp-useref path
    var cssFilter = plug.filter('**/app.css');
    var cssAllFilter = plug.filter('**/*.css');
    var jsFilter = plug.filter('**/app.js');
    var jslibFilter = plug.filter('**/lib.js');

    var templateCache = config.temp + config.templateCache.file;

    var stream = gulp
            .src(config.client + 'index.html')
            .pipe(plug.inject(gulp.src(templateCache, {read: false}), {
                starttag: '<!-- inject:templates:js -->'
            }))
            .pipe(assets) // Gather all assets from the html with useref
            .pipe(cssFilter)
            .pipe(plug.less())
            .pipe(plug.autoprefixer('last 2 version', '> 5%'))
            .pipe(cssFilter.restore());

    if (!env.prod) {
        stream
            .pipe(assets.restore())
            .pipe(plug.useref())
            .pipe(gulp.dest(config.build));
    } else {
        stream
            // Get the css
            .pipe(cssAllFilter)
            .pipe(plug.csso())
            .pipe(cssAllFilter.restore())
            // Get the custom javascript
            .pipe(jsFilter)
            .pipe(plug.ngAnnotate({add: true}))
            .pipe(plug.uglify())
            .pipe(getHeader())
            .pipe(jsFilter.restore())
            // Get the vendor javascript
            .pipe(jslibFilter)
            .pipe(plug.uglify())
            .pipe(jslibFilter.restore())
            // Add file names revisions
            .pipe(plug.rev())
            // Apply the concat and file replacement with useref
            .pipe(assets.restore())
            .pipe(plug.useref())
            // Replace the file names in the html
            .pipe(plug.revReplace())
            .pipe(gulp.dest(config.build));
    }

    stream.on('end', function() {
        var msg = {
            title: 'gulp build',
            subtitle: 'Deployed to the build folder',
            message: 'gulp serve-build --sync'
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
 * Remove all files from the build, temp, and reports folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean', function(done) {
    var delconfig = [].concat(config.build, config.temp, config.report);
    log('Cleaning: ' + plug.util.colors.blue(delconfig));
    del(delconfig, done);
});

/**
 * Remove all fonts from the build folder
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-fonts', function(done) {
    clean([].concat(config.build + 'fonts/**/*.*'), done);
});

/**
 * Remove all images from the build folder
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-images', function(done) {
    clean([].concat(config.build + 'images/**/*.*'), done);
});

/**
 * Remove all styles, js, and html from the build folder
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-code', function(done) {
    var files = [].concat(
        config.temp,
        config.build + 'js/**/*.js',
        config.build + 'styles/**/*.css',
        config.build + '**/*.html'
        );
    clean(files, done);
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
 * serve the dev environment
 * --debug-brk or --debug
 * --dev (default) or -- prod
 * --sync
 */
gulp.task('serve', function() {
    var options = {
        script: config.server + 'app.js',
        delayTime: 1,
        env: {'PORT': port},
        watch: [config.server]
    };

    var exec;
    var debug = env.debug || env.debugBrk;
    if (debug) {
        log('Running node-inspector. Browse to http://localhost:8080/debug?port=5858');
        exec = require('child_process').exec;
        exec('node-inspector');
        options.nodeArgs = [debug + '=5858'];
    }

    gulp.watch([config.less, config.js, config.html], ['html'])
        .on('change', function(event) {
            changeEvent(event);
        });

    return plug.nodemon(options)
        .on('start', startBrowserSync)
        .on('restart', function() {
            log('restarted!');
            setTimeout(function() {
                browserSync.reload({
                    stream: false
                });
            }, 1000);
        });
});

////////////////

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
function clean(path, done) {
    log('Cleaning: ' + plug.util.colors.blue(path));
    del(path, done);
}

/**
 * Start BrowserSync
 * --sync will start browserSync too
 */
function startBrowserSync() {
    if (!env.sync || browserSync.active) {
        return;
    }

    log('Starting BrowserSync on port ' + port);
    browserSync({
        proxy: 'localhost:' + port,
        port: 3000,
        // files: [config.client + '/**/*.*'],
        files: [config.build + '/**/*.*'],
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
        (data.startSize / 1000).toFixed(2) + ' kB to ' +
        (data.endSize / 1000).toFixed(2) + ' kB and is ' +
        formatPercent(1 - data.percent, 2) + '%' + difference;
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
        ' */'
    ].join('\n');
    return plug.header(template, {
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
