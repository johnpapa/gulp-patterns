module.exports = function () {
  return {
    files: [
      { pattern: 'node_modules/chai/chai.js', instrument: false },
      { pattern: 'node_modules/mocha-clean/index.js', instrument: false },
      { pattern: 'node_modules/sinon-chai/lib/sinon-chai.js', instrument: false },
      { pattern: 'bower_components/jquery/dist/jquery.js', instrument: false },
      { pattern: 'bower_components/angular/angular.js', instrument: false },
      { pattern: 'bower_components/angular-sanitize/angular-sanitize.js', instrument: false },
      { pattern: 'bower_components/bootstrap/dist/js/bootstrap.js', instrument: false },
      { pattern: 'bower_components/extras.angular.plus/ngplus-overlay.js', instrument: false },
      { pattern: 'bower_components/moment/moment.js', instrument: false },
      { pattern: 'bower_components/angular-ui-router/release/angular-ui-router.js', instrument: false },
      { pattern: 'bower_components/toastr/toastr.js', instrument: false },
      { pattern: 'bower_components/angular-animate/angular-animate.js', instrument: false },
      { pattern: 'bower_components/angular-mocks/angular-mocks.js', instrument: false },
      { pattern: 'bower_components/sinon/index.js', instrument: false },
      { pattern: 'bower_components/bardjs/dist/bard.js', instrument: false },
      { pattern: 'bower_components/bardjs/dist/bard-ngRouteTester.js', instrument: false },

      { pattern: 'src/client/test-helpers/bind-polyfill.js', instrument: false },
      { pattern: 'src/client/test-helpers/mock-data.js', instrument: false },

      { pattern: 'src/client/app/**/*.html' },
      // { pattern: 'src/client/app/**/*.css', load: true },
      // { pattern: 'src/client/app/**/*.js', load: true },

      { pattern: 'src/client/app/app.module.js', instrument: true },
      { pattern: 'src/client/app/blocks/diagnostics/diagnostics.module.js', instrument: true },
      { pattern: 'src/client/app/blocks/exception/exception.module.js', instrument: true },
      { pattern: 'src/client/app/blocks/logger/logger.module.js', instrument: true },
      { pattern: 'src/client/app/blocks/router/router.module.js', instrument: true },
      { pattern: 'src/client/app/core/core.module.js', instrument: true },
      { pattern: 'src/client/app/customers/customers.module.js', instrument: true },
      { pattern: 'src/client/app/dashboard/dashboard.module.js', instrument: true },
      { pattern: 'src/client/app/layout/layout.module.js', instrument: true },
      { pattern: 'src/client/app/widgets/widgets.module.js', instrument: true },
      { pattern: 'src/client/app/blocks/diagnostics/diagnostics.decorator.js', instrument: true },
      { pattern: 'src/client/app/blocks/exception/exception-handler.provider.js', instrument: true },
      { pattern: 'src/client/app/blocks/exception/exception.js', instrument: true },
      { pattern: 'src/client/app/blocks/logger/logger.js', instrument: true },
      { pattern: 'src/client/app/blocks/router/router-helper.provider.js', instrument: true },
      { pattern: 'src/client/app/core/config.js', instrument: true },
      { pattern: 'src/client/app/core/constants.js', instrument: true },
      { pattern: 'src/client/app/core/core.route.js', instrument: true },
      { pattern: 'src/client/app/core/dataservice.js', instrument: true },
      { pattern: 'src/client/app/customers/customer-detail.controller.js', instrument: true },
      { pattern: 'src/client/app/customers/customers.controller.js', instrument: true },
      { pattern: 'src/client/app/customers/customers.route.js', instrument: true },
      { pattern: 'src/client/app/dashboard/dashboard.controller.js', instrument: true },
      { pattern: 'src/client/app/dashboard/dashboard.route.js', instrument: true },
      { pattern: 'src/client/app/layout/ht-sidebar.directive.js', instrument: true },
      { pattern: 'src/client/app/layout/ht-top-nav.directive.js', instrument: true },
      { pattern: 'src/client/app/layout/shell.controller.js', instrument: true },
      { pattern: 'src/client/app/layout/sidebar.controller.js', instrument: true },
      { pattern: 'src/client/app/widgets/ht-img-person.directive.js', instrument: true },
      { pattern: 'src/client/app/widgets/ht-widget-header.directive.js', instrument: true },

    ],
    tests: [
      'src/client/app/**/*.spec.js',
      '!src/client/app/layout/ht-sidebar.directive.spec.js',
      '!src/client/app/layout/sidebar.controller.spec.js',
      '!src/client/app/core/core.route.spec.js',
      '!src/client/app/customers/customer-detail.controller.spec.js'
    ],
    env: {
      type: 'browser'
      // runner: require('phantomjs2-ext').path,
      // params: { runner: '--web-security=false' }
    },
    testFramework: 'mocha',
    setup: function () {
      window.expect = chai.expect;
    },
    debug: true
  };
};
