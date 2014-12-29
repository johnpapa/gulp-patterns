module.exports = function() {
    var client = './src/client/';
    var server = './src/server/';
    var clientApp = client + 'app/';
    var root = './';
    var specRunnerFile = 'specs.html';
    var temp = './.tmp/';

    var config = {
        /**
         * File paths
         */
        root: root,
        client: client,
        server: server,
        source: 'src/',
        htmltemplates: clientApp + '/**/*.html',
        css: temp + '/styles.css',
        less: client + '/styles/styles.less',
        html: client + '/**/*.html',
        index: client + '/index.html',
        js: [
            clientApp + '/**/*.module.js',
            clientApp + '/**/*.js',
            '!' + clientApp + '/**/*.spec.js'
        ],
        alljs: [
            './src/**/*.js',
            './*.js'
        ],
        plato: {js: clientApp + '/**/*.js'},
        fonts: './bower_components/font-awesome/fonts/**/*.*',
        images: client + '/images/**/*.*',
        build: './build/',
        temp: temp,
        report: './report/',

        /**
         * browser sync
         */
        browserReloadDelay: 1000,

        /**
         * Template Cache settings
         */
        templateCache: {
            module: 'app.core',
            file: 'templates.js',
            root: 'app/',
            standAlone: false,
            path: temp
        },

        /**
         * Bower and NPM locations
         */
        bower: {
            directory: './bower_components/',
            ignorePath: '../..'
        },
        packages: [
            './package.json',
            './bower.json'
        ],

        /**
         * specs.html, our HTML spec runner
         */
        specRunner: client + specRunnerFile,
        specRunnerFile: specRunnerFile,

        /**
         * The sequence of the injections into specs.html:
         *  1 testlibraries
         *      mocha setup
         *  2 bower
         *  3 js
         *  4 spechelpers
         *  5 specs
         *  6 templates
         */
        testlibraries: [
            'node_modules/mocha/mocha.js',
            'node_modules/chai/chai.js',
            'node_modules/mocha-clean/index.js',
            'node_modules/sinon-chai/lib/sinon-chai.js'
        ],
        specHelpers: [client + '/test-helpers/*.js'],
        specs: [clientApp + '/**/*.spec.js'],

        /**
         * Node settings
         */
        nodeServer: './src/server/app.js',
        defaultPort: '7203'
    };

    return config;
};
