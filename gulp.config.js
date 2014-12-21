module.exports = function() {
    var service = {
        getConfig: getConfig
    };
    return service;

    function getConfig() {
        return {
            client: './src/client/',
            server: './src/server/',
            htmltemplates: './src/client/app/**/*.html',
            less: './src/client/styles/styles.less',
            html: './src/client/**/*.html',
            index: './src/client/index.html',
            js: [
                './src/client/app/**/*.module.js',
                './src/client/app/**/*.js',
                '!./src/client/app/**/*.spec.js'
            ],
            specs: ['./src/client/app/**/*.spec.js'],
            alljs: [
                './src/**/*.js',
                './*.js'
            ],
            specHelpers: ['./src/client/test-helpers/*.js'],
            specRunner: './src/client/specs.html',
            appjs: './src/client/app/**/*.js',
            fonts: './bower_components/font-awesome/fonts/**/*.*',
            images: './src/client/images/**/*.*',
            build: './build/',
            temp: './.tmp/',
            report: './report/',
            nodeServer: './src/server/app.js',
            defaultPort: '7203',
            browserReloadDelay: 1000,
            templateCache: {
                module: 'app.core',
                file: 'templates.js',
                root: 'app/'
            },
            bower: {
                directory: './bower_components/',
                ignorePath: '../..'
            }
        };
    }
};
