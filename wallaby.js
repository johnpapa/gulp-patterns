// jshint ignore: start
// jscs:disable

var wiredep = require('wiredep');
var angularTemplatePreprocessor = require('wallaby-ng-html2js-preprocessor');

module.exports = function () {
  return {
    files: [
      // testing libs
      {pattern: 'node_modules/chai/chai.js', instrument: false},
      {pattern: 'node_modules/mocha-clean/index.js', instrument: false},
      {pattern: 'node_modules/sinon-chai/lib/sinon-chai.js', instrument: false}
    ]
    // bower deps
      .concat(wiredep({devDependencies: true, directory: './bower_components/'})['js'].map(function (dep) {
        return {pattern: dep, instrument: false}
      }))
      .concat([
        // helpers
        {pattern: 'src/client/test-helpers/*.js', instrument: false},

        // app files
        'src/client/app/**/*.module.js',
        'src/client/app/**/!(*.spec)+(.js)',
        'src/client/app/**/*.html'
      ]),

    tests: [
      'src/client/app/**/*.spec.js'
    ],

    preprocessors: {
      '**/*.html': function (file) {
        return angularTemplatePreprocessor.transform(file, {stripPrefix: 'src/client/', moduleName: 'app.core'})
      }
    },

    testFramework: 'mocha',

    setup: function () {
      window.expect = chai.expect;
      window.AssertionError = chai.AssertionError;
      mocha.setup('bdd');
      mocha.traceIgnores = ['mocha.js', 'chai.js', 'angular.js'];
    },

    debug: true
  };
};
