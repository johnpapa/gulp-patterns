module.exports = function(config) {
  config.set({
    basePath : '../',
    files : [
      './node_modules/chai/chai.js',
      './bower_components/angularjs/index.js',
      './bower_components/angularjs-route/index.js',
      './src/ngMidwayTester.js',
      './test/lib/chai.js',
      './test/spec/ngMidwayTesterSpec.js'
    ],
    singleRun: true,
    frameworks: ['mocha'],
    browsers: ['Chrome'],
    proxies: {
      '/': 'http://localhost:8844/'
    }
  });
};
