(function() {
    'use strict';

    angular.module('app', [
        'app.core',
        'app.widgets',
        'app.customers',
        'app.dashboard',
        'app.layout'
    ]);
    
})();
(function() {
    'use strict';

    angular.module('app.core', [
        /*
         * Angular modules
         */
        'ngAnimate', 'ngRoute', 'ngSanitize',
        /*
         * Our reusable cross app code modules
         */
        'blocks.exception', 'blocks.logger', 'blocks.router',
        /*
         * 3rd Party modules
         */
        'ngplus'
    ]);
})();

(function() {
    'use strict';

    angular.module('app.customers', []);
})();

(function() {
    'use strict';

    angular.module('app.dashboard', []);
})();

(function() {
    'use strict';

    angular.module('app.layout', []);
})();

(function() {
    'use strict';

    angular.module('app.widgets', []);
})();

(function() {
    'use strict';

    angular.module('blocks.exception', ['blocks.logger']);
})();

(function() {
    'use strict';

    angular.module('blocks.logger', []);
})();

(function() {
    'use strict';

    angular.module('blocks.router', [
        'ngRoute',
        'blocks.logger'
    ]);
})();

(function() {
    'use strict';

    var core = angular.module('app.core');

    core.config(toastrConfig);

    /* @ngInject */
    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }
    toastrConfig.$inject = ['toastr'];

    var config = {
        appErrorPrefix: '[GulpPatterns Error] ', //Configure the exceptionHandler decorator
        appTitle: 'Gulp Patterns Demo',
        imageBasePath: '/content/images/photos/',
        unknownPersonImageSource: 'unknown_person.jpg',
        version: '1.0.0'
    };

    core.value('config', config);

    core.config(configure);

    /* @ngInject */
    function configure ($logProvider, $routeProvider, routehelperConfigProvider, exceptionHandlerProvider) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }

        // Configure the common route provider
        routehelperConfigProvider.config.$routeProvider = $routeProvider;
        routehelperConfigProvider.config.docTitle = 'GulpPatterns: ';
        var resolveAlways = { /* @ngInject */
            ready: ['dataservice', function(dataservice) {
                return dataservice.ready();
            }]
            // ready: ['dataservice', function (dataservice) {
            //    return dataservice.ready();
            // }]
        };
        routehelperConfigProvider.config.resolveAlways = resolveAlways;

        // Configure the common exception handler
        exceptionHandlerProvider.configure(config.appErrorPrefix);
    }
    configure.$inject = ['$logProvider', '$routeProvider', 'routehelperConfigProvider', 'exceptionHandlerProvider'];
})();

/* global toastr:false, moment:false */
(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('toastr', toastr)
        .constant('moment', moment);
})();

(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('dataservice', dataservice);

    /* @ngInject */
    function dataservice($http, $location, $q, exception, logger) {
        var isPrimed = false;
        var primePromise;

        var service = {
            getCustomer: getCustomer,
            getCustomers: getCustomers,
            ready: ready
        };

        return service;

        function getCustomer(id) {
            return $http.get('/api/customer/' + id)
                .then(getCustomerComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getCustomer')(message);
                    $location.url('/');
                });

            function getCustomerComplete(data, status, headers, config) {
                return data.data;
            }
        }

        function getCustomers() {
            return $http.get('/api/customers')
                .then(getCustomersComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getCustomers')(message);
                    $location.url('/');
                });

            function getCustomersComplete(data, status, headers, config) {
                return data.data;
            }
        }

        function prime() {
            // This function can only be called once.
            if (primePromise) {
                return primePromise;
            }

            primePromise = $q.when(true).then(success);
            return primePromise;

            function success() {
                isPrimed = true;
                logger.info('Primed data');
            }
        }

        function ready(nextPromises) {
            var readyPromise = primePromise || prime();

            return readyPromise
                .then(function() { return $q.all(nextPromises); })
                .catch(exception.catcher('"ready" function failed'));
        }

    }
    dataservice.$inject = ['$http', '$location', '$q', 'exception', 'logger'];
})();

(function() {
    'use strict';

    angular
        .module('app.customers')
        .controller('CustomerDetail', CustomerDetail);

    /* @ngInject */
    function CustomerDetail($routeParams, $window, dataservice, logger) {
        /*jshint validthis: true */
        var vm = this;
        vm.cancel = cancel;
        vm.customer = undefined;
        vm.goBack = goBack;
        vm.isUnchanged = isUnchanged;
        vm.getFullName = getFullName;
        vm.save = save;
        vm.title = 'Customer Detail';

        activate();

        function activate() {
            return getCustomer($routeParams.id).then(function() {
                logger.info('Activated Customer Detail View');
            });
        }

        function cancel() {
            vm.customer = angular.copy(vm.original);
        }

        function getCustomer(id) {
            return dataservice.getCustomer(id).then(function(data) {
                vm.customer = data;
                vm.original = angular.copy(vm.customer);
                return vm.customer;
            });
        }

        function goBack() {
            $window.history.back();
        }

        function isUnchanged() {
            return angular.equals(vm.customer, vm.original);
        }

        function getFullName() {
            return vm.customer && vm.customer.firstName + ' ' + vm.customer.lastName;
        }

        function save() {
            vm.original = angular.copy(vm.customer);
            logger.success('Saving Customer (not really)');
        }
    }
    CustomerDetail.$inject = ['$routeParams', '$window', 'dataservice', 'logger'];
})();
(function() {
    'use strict';

    angular
        .module('app.customers')
        .controller('Customers', Customers);

    /* @ngInject */
    function Customers($location, dataservice, logger) {
        /*jshint validthis: true */
        var vm = this;
        vm.customers = [];
        vm.gotoCustomer = gotoCustomer;
        vm.title = 'Customers';

        activate();

        function activate() {
            return getCustomers().then(function() {
                logger.info('Activated Customers View');
            });
        }

        function getCustomers() {
            return dataservice.getCustomers().then(function(data) {
                vm.customers = data;
                return vm.customers;
            });
        }

        function gotoCustomer(c) {
            $location.path('/customer/' + c.id);
        }
    }
    Customers.$inject = ['$location', 'dataservice', 'logger'];
})();

(function() {
    'use strict';

    angular
        .module('app.customers')
        .run(appRun);

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }
    appRun.$inject = ['routehelper'];

    function getRoutes() {
        return [
            {
                url: '/customers',
                config: {
                    templateUrl: 'app/customers/customers.html',
                    controller: 'Customers',
                    controllerAs: 'vm',
                    title: 'Customers',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-group"></i> Customers'
                    }
                }
            },
            {
                url: '/customer/:id',
                config: {
                    templateUrl: 'app/customers/customer-detail.html',
                    controller: 'CustomerDetail',
                    controllerAs: 'vm',
                    title: 'Customer Detail'
                }
            }
        ];
    }
})();

(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('Dashboard', Dashboard);

    function Dashboard($location, dataservice, logger) {
        /*jshint validthis: true */
        var vm = this;
        vm.customers = [];
        vm.gotoCustomer = gotoCustomer;
        vm.news = {
            title: 'Customers',
            description: 'Customer news'
        };
        vm.title = 'Dashboard';

        activate();

        function activate() {
            return getCustomers().then(function() {
                logger.info('Activated Dashboard View');
            });
        }

        function getCustomers() {
            return dataservice.getCustomers().then(function(data) {
                vm.customers = data;
                return vm.customers;
            });
        }

        function gotoCustomer(c) {
            $location.path('/customer/' + c.id);
        }
    }
    Dashboard.$inject = ['$location', 'dataservice', 'logger'];
})();

(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .run(appRun);

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }
    appRun.$inject = ['routehelper'];

    function getRoutes() {
        return [
            {
                url: '/',
                config: {
                    templateUrl: 'app/dashboard/dashboard.html',
                    controller: 'Dashboard',
                    controllerAs: 'vm',
                    title: 'dashboard',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            }
        ];
    }
})();

(function() {
    'use strict';

    angular
        .module('app.layout')
        .controller('Shell', Shell);

    /* @ngInject */
    function Shell($timeout, config, logger) {
        /*jshint validthis: true */
        var vm = this;

        vm.title = config.appTitle;
        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.showSplash = true;

        activate();

        function activate() {
            logger.success(config.appTitle + ' loaded!', null);
            hideSplash();
        }

        function hideSplash() {
            //Force a 1 second delay so we can see the splash.
            $timeout(function() {
                vm.showSplash = false;
            }, 1000);
        }
    }
    Shell.$inject = ['$timeout', 'config', 'logger'];
})();

(function() {
    'use strict';

    angular
        .module('app.layout')
        .controller('Sidebar', Sidebar);

    /* @ngInject */
    function Sidebar($route, routehelper) {
        /*jshint validthis: true */
        var vm = this;
        var routes = routehelper.getRoutes();
        vm.isCurrent = isCurrent;
        //vm.sidebarReady = function(){console.log('done animating menu')}; // example

        activate();

        function activate() { getNavRoutes(); }

        function getNavRoutes() {
            vm.navRoutes = routes.filter(function(r) {
                return r.settings && r.settings.nav;
            }).sort(function(r1, r2) {
                return r1.settings.nav - r2.settings.nav;
            });
        }

        function isCurrent(route) {
            if (!route.title || !$route.current || !$route.current.title) {
                return '';
            }
            var menuName = route.title;
            return $route.current.title.substr(0, menuName.length) === menuName ? 'current' : '';
        }
    }
    Sidebar.$inject = ['$route', 'routehelper'];
})();

(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('ccImgPerson', ccImgPerson);

    /* @ngInject */
    function ccImgPerson (config) {
        //Usage:
        //<img cc-img-person="{{person.imageSource}}"/>
        var basePath = config.imageBasePath;
        var unknownImage = config.unknownPersonImageSource;
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$observe('ccImgPerson', function (value) {
                value = basePath + (value || unknownImage);
                attrs.$set('src', value);
            });
        }
    }
    ccImgPerson.$inject = ['config'];
})();
(function() {
    'use strict';

    angular
        .module('app.widgets')
        .directive('ccSidebar', ccSidebar);

    /* @ngInject */
    function ccSidebar () {
        // Opens and closes the sidebar menu.
        // Usage:
        //  <div data-cc-sidebar">
        //  <div data-cc-sidebar whenDoneAnimating="vm.sidebarReady()">
        // Creates:
        //  <div data-cc-sidebar class="sidebar">
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                whenDoneAnimating: '&?'
            }
        };
        return directive;

        function link(scope, element, attrs) {
            var $sidebarInner = element.find('.sidebar-inner');
            var $dropdownElement = element.find('.sidebar-dropdown a');
            element.addClass('sidebar');
            $dropdownElement.click(dropdown);

            function dropdown(e) {
                var dropClass = 'dropy';
                e.preventDefault();
                if (!$dropdownElement.hasClass(dropClass)) {
                    $sidebarInner.slideDown(350, scope.whenDoneAnimating);
                    $dropdownElement.addClass(dropClass);
                } else if ($dropdownElement.hasClass(dropClass)) {
                    $dropdownElement.removeClass(dropClass);
                    $sidebarInner.slideUp(350, scope.whenDoneAnimating);
                }
            }
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('app.widgets')
        .directive('ccWidgetHeader', ccWidgetHeader);

    /* @ngInject */
    function ccWidgetHeader () {
        //Usage:
        //<div data-cc-widget-header title="vm.map.title"></div>
        // Creates:
        // <div data-cc-widget-header=""
        //      title="Movie"
        //      allow-collapse="true" </div>
        var directive = {
//            link: link,
            scope: {
                'title': '@',
                'subtitle': '@',
                'rightText': '@',
                'allowCollapse': '@'
            },
            templateUrl: 'app/widgets/widgetheader.html',
            restrict: 'A'
        };
        return directive;

//        function link(scope, element, attrs) {
//            attrs.$set('class', 'widget-head');
//        }
    }
})();

// Include in index.html so that app level exceptions are handled.
// Exclude from testRunner.html which should run exactly what it wants to run
(function() {
    'use strict';

    angular
        .module('blocks.exception')
        .provider('exceptionHandler', exceptionHandlerProvider)
        .config(config);

    /**
     * Must configure the exception handling
     * @return {[type]}
     */
    function exceptionHandlerProvider() {
        /* jshint validthis:true */
        this.config = {
            appErrorPrefix: undefined
        };

        this.configure = function (appErrorPrefix) {
            this.config.appErrorPrefix = appErrorPrefix;
        };

        this.$get = function() {
            return {config: this.config};
        };
    }

    /**
     * Configure by setting an optional string value for appErrorPrefix.
     * Accessible via config.appErrorPrefix (via config value).
     * @param  {[type]} $provide
     * @return {[type]}
     * @ngInject
     */
    function config($provide) {
        $provide.decorator('$exceptionHandler', extendExceptionHandler);
    }
    config.$inject = ['$provide'];

    /**
     * Extend the $exceptionHandler service to also display a toast.
     * @param  {Object} $delegate
     * @param  {Object} exceptionHandler
     * @param  {Object} logger
     * @return {Function} the decorated $exceptionHandler service
     */
    function extendExceptionHandler($delegate, exceptionHandler, logger) {
        return function(exception, cause) {
            var appErrorPrefix = exceptionHandler.config.appErrorPrefix || '';
            var errorData = {exception: exception, cause: cause};
            exception.message = appErrorPrefix + exception.message;
            $delegate(exception, cause);
            /**
             * Could add the error to a service's collection,
             * add errors to $rootScope, log errors to remote web server,
             * or log locally. Or throw hard. It is entirely up to you.
             * throw exception;
             *
             * @example
             *     throw { message: 'error message we added' };
             */
            logger.error(exception.message, errorData);
        };
    }
    extendExceptionHandler.$inject = ['$delegate', 'exceptionHandler', 'logger'];
})();

(function() {
    'use strict';

    angular
        .module('blocks.exception')
        .factory('exception', exception);

    /* @ngInject */
    function exception(logger) {
        var service = {
            catcher: catcher
        };
        return service;

        function catcher(message) {
            return function(reason) {
                logger.error(message, reason);
            };
        }
    }
    exception.$inject = ['logger'];
})();
(function() {
    'use strict';

    angular
        .module('blocks.logger')
        .factory('logger', logger);

    logger.$inject = ['$log', 'toastr'];

    function logger($log, toastr) {
        var service = {
            showToasts: true,

            error   : error,
            info    : info,
            success : success,
            warning : warning,

            // straight to console; bypass toastr
            log     : $log.log
        };

        return service;
        /////////////////////

        function error(message, data, title) {
            toastr.error(message, title);
            $log.error('Error: ' + message, data);
        }

        function info(message, data, title) {
            toastr.info(message, title);
            $log.info('Info: ' + message, data);
        }

        function success(message, data, title) {
            toastr.success(message, title);
            $log.info('Success: ' + message, data);
        }

        function warning(message, data, title) {
            toastr.warning(message, title);
            $log.warn('Warning: ' + message, data);
        }
    }
}());

(function() {
    'use strict';

    angular
        .module('blocks.router')
        .provider('routehelperConfig', routehelperConfig)
        .factory('routehelper', routehelper);

    routehelper.$inject = ['$location', '$rootScope', '$route', 'logger', 'routehelperConfig'];

    // Must configure via the routehelperConfigProvider
    function routehelperConfig() {
        /* jshint validthis:true */
        this.config = {
            // These are the properties we need to set
            // $routeProvider: undefined
            // docTitle: ''
            // resolveAlways: {ready: function(){ } }
        };

        this.$get = function() {
            return {
                config: this.config
            };
        };
    }

    function routehelper($location, $rootScope, $route, logger, routehelperConfig) {
        var handlingRouteChangeError = false;
        var routeCounts = {
            errors: 0,
            changes: 0
        };
        var routes = [];
        var $routeProvider = routehelperConfig.config.$routeProvider;

        var service = {
            configureRoutes: configureRoutes,
            getRoutes: getRoutes,
            routeCounts: routeCounts
        };

        init();

        return service;
        ///////////////

        function configureRoutes(routes) {
            routes.forEach(function(route) {
                route.config.resolve =
                    angular.extend(route.config.resolve || {}, routehelperConfig.config.resolveAlways);
                $routeProvider.when(route.url, route.config);
            });
            $routeProvider.otherwise({redirectTo: '/'});
        }

        function handleRoutingErrors() {
            // Route cancellation:
            // On routing error, go to the dashboard.
            // Provide an exit clause if it tries to do it twice.
            $rootScope.$on('$routeChangeError',
                function(event, current, previous, rejection) {
                    if (handlingRouteChangeError) {
                        return;
                    }
                    routeCounts.errors++;
                    handlingRouteChangeError = true;
                    var destination = (current && (current.title || current.name || current.loadedTemplateUrl)) ||
                        'unknown target';
                    var msg = 'Error routing to ' + destination + '. ' + (rejection.msg || '');
                    logger.warning(msg, [current]);
                    $location.path('/');
                }
            );
        }

        function init() {
            handleRoutingErrors();
            updateDocTitle();
        }

        function getRoutes() {
            for (var prop in $route.routes) {
                if ($route.routes.hasOwnProperty(prop)) {
                    var route = $route.routes[prop];
                    var isRoute = !!route.title;
                    if (isRoute) {
                        routes.push(route);
                    }
                }
            }
            return routes;
        }

        function updateDocTitle() {
            $rootScope.$on('$routeChangeSuccess',
                function(event, current, previous) {
                    routeCounts.changes++;
                    handlingRouteChangeError = false;
                    var title = routehelperConfig.config.docTitle + ' ' + (current.title || '');
                    $rootScope.title = title; // data bind to <title>
                }
            );
        }
    }
})();

angular.module("app.core").run(["$templateCache", function($templateCache) {$templateCache.put("app/customers/customer-detail.html","<section class=\"mainbar\">\n    <section class=\"matter\">\n        <div class=\"container\">\n            <div>\n                <button class=\"btn btn-info btn-form-md\"\n                        ng-click=\"vm.goBack()\">\n                    <i class=\"fa fa-hand-o-left\"></i>Back\n                </button>\n                <button class=\"btn btn-info btn-form-md\"\n                        ng-click=\"vm.cancel()\" \n                        ng-disabled=\"vm.isUnchanged()\">\n                    <i class=\"fa fa-undo\"></i>Cancel\n                </button>\n                <button class=\"btn btn-info btn-form-md\"\n                        ng-click=\"vm.save()\" \n                        ng-disabled=\"form.$invalid || vm.isUnchanged()\">\n                    <i class=\"fa fa-save\"></i>Save\n                </button>\n\n                <!--Need ng-hide for show/hide animations-->\n                <span ng-hide=\"vm.isUnchanged()\" class=\"dissolve-animation ng-hide flag-haschanges\">\n                    <i class=\"fa fa-asterisk fa fa-asterisk-large\" rel=\"tooltip\" title=\"You have changes\"></i>\n                </span>\n            </div>\n            <div class=\"widget wblue\">\n                <div data-cc-widget-header title=\"Edit {{vm.getFullName() || \'New Customer\'}}\"></div>\n                <div class=\"widget-content user\">\n                    <div class=\"form-group\">\n                      <label class=\"control-label\">ID: </label>\n                      <label class=\"control-label\">{{vm.customer.id}}</label>\n                    </div>\n                    <div class=\"form-group\">\n                      <label class=\"control-label\">First Name</label>\n                      <div>\n                          <input class=\"form-control\"\n                                 ng-model=\"vm.customer.firstName\"\n                                 placeholder=\"First Name\"/>\n                      </div>\n                    </div>\n                    <div class=\"form-group\">\n                      <label class=\"control-label\">Last Name</label>\n                      <div>\n                          <input class=\"form-control\"\n                                 ng-model=\"vm.customer.lastName\"\n                                 placeholder=\"Last Name\"/>\n                      </div>\n                    </div>\n                    <div class=\"form-group\">\n                        <label class=\"control-label\">City</label>\n                        <div>\n                            <input class=\"form-control\"\n                                   ng-model=\"vm.customer.city\"\n                                   placeholder=\"City\"/>\n                        </div>\n                    </div>\n                    <div class=\"form-group\">\n                        <label class=\"control-label\">State</label>\n                        <div>\n                            <input class=\"form-control\"\n                                   ng-model=\"vm.customer.state\"\n                                   placeholder=\"State\"/>\n                        </div>\n                    </div>\n                    <div class=\"form-group\">\n                        <label class=\"control-label\">Postal Code</label>\n                        <div>\n                            <input class=\"form-control\"\n                                   ng-model=\"vm.customer.zip\"\n                                   placeholder=\"Postal Code\"/>\n                        </div>\n                    </div>\n                    <div class=\"form-group\">\n                        <img cc-img-person=\"{{vm.customer.thumbnail}}\" class=\"img-thumbnail\"/>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </section>\n</section>");
$templateCache.put("app/customers/customers.html","<section class=\"mainbar\">\n    <section class=\"matter\">\n        <div class=\"container\">\n            <div class=\"row\">\n                <div class=\"widget wblue\">\n                    <div cc-widget-header title=\"{{vm.title}}\"></div>\n                    <div class=\"widget-content user\">\n                        <input ng-model=\"vm.filter.name\" placeholder=\"Find customers by name\" type=\"search\"/>\n                        <table class=\"table table-condensed table-hover\">\n                            <thead>\n                            <tr>\n<!--                                 <th></th> -->\n                                <th>Customer</th>\n                                <th>City</th>\n                                <th>State</th>\n                            </tr>\n                            </thead>\n                            <tbody>\n                            <tr ng-repeat=\"c in vm.customers | filter:vm.filter track by c.id\" \n                                ng-click=\"vm.gotoCustomer(c)\">\n<!--                                 <td><img\n                                        ng-src=\"{{c.thumbnail.path}}.{{c.thumbnail.extension}}\"\n                                        class=\"customer-thumb img-rounded\"/></td> -->\n                                <td>{{c.firstName + \' \' + c.lastName}}</td>\n                                <td>{{c.city}}</td>\n                                <td>{{c.state}}</td>\n                            </tr>\n                            </tbody>\n                        </table>\n                    </div>\n                    <div class=\"widget-foot\">\n                        <div class=\"clearfix\"></div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </section>\n</section>\n");
$templateCache.put("app/dashboard/dashboard.html","<section id=\"dashboard-view\" class=\"mainbar\">\n    <section class=\"matter\">\n        <div class=\"container\">\n            <div class=\"row\">\n                <div class=\"col-md-12\">\n                    <ul class=\"today-datas\">\n                        <li class=\"borange\">\n                            <div class=\"pull-left\"><i class=\"fa fa-coffee\"></i></div>\n                            <div class=\"datas-text pull-right\">\n                                <a href=\"http://www.gulpjs.com\"><span class=\"bold\">Gulp</span></a>\n                            </div>\n                            <div class=\"clearfix\"></div>\n                        </li>\n\n                        <li class=\"bviolet\">\n                            <div class=\"pull-left\"><i class=\"fa fa-users\"></i></div>\n                            <div class=\"datas-text pull-right\">\n                                <span class=\"bold\">{{vm.customers.length}}</span> Customers\n                            </div>\n                            <div class=\"clearfix\"></div>\n                        </li>\n\n                    </ul>\n                </div>\n            </div>\n            <div class=\"row\">\n                    <div class=\"widget wblue\">\n                        <div data-cc-widget-header title=\"Recent Customers\"\n                             allow-collapse=\"true\"></div>\n                        <div class=\"widget-content text-center text-info\">\n\n                            <div class=\"container\">\n                                 <ul class=\"row image-group\">\n                                      <li ng-repeat=\"c in vm.customers | limitTo:12 | orderBy:\'name\'\" \n                                        ng-click=\"vm.gotoCustomer(c)\"\n                                        class=\"col-lg-2 col-md-2 col-sm-3 col-xs-4\">\n                                        <div class=\"user\" title=\"Go to speaker details\">\n                                            <img cc-img-person=\"{{c.thumbnail}}\" \n                                                class=\"img-thumbnail stacked\">\n                                            <div>\n                                                <small>{{c.firstName}}</small>\n                                            </div>\n                                            <div>\n                                                <small>{{c.lastName}}</small>\n                                            </div>\n                                        </div>\n\n                                      </li>\n                                 </ul>\n                            </div>\n                        </div>\n                        <div class=\"widget-foot\">\n                            <div class=\"clearfix\"></div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </section>\n</section>");
$templateCache.put("app/layout/footer.html","<nav class=\"navbar navbar-fixed-bottom navbar-default\">\n        <div class=\"navbar-logo\">\n            <ul class=\"nav navbar-nav dont-stack\">\n                <li>\n                    <a href=\"http://www.johnpapa.net/hottowel-angular\" target=\"_blank\">\n                        Created by John Papa\n                    </a>\n                </li>\n                <li class=\"dropdown dropdown-big\">\n                    <a href=\"http://www.angularjs.org\" target=\"_blank\">\n                        <img src=\"content/images/AngularJS-small.png\" />\n                    </a>\n                </li>\n                <li>\n                    <a href=\"http://www.gulpjs.com/\" target=\"_blank\">\n                        <img src=\"content/images/gulp-tiny.png\" />\n                    </a>\n                </li>\n            </ul>\n        </div>\n</nav>");
$templateCache.put("app/layout/shell.html","<div data-ng-controller=\"Shell as vm\">\n    <div id=\"splash-page\" data-ng-show=\"vm.showSplash\" class=\"dissolve-animation\">\n        <div class=\"page-splash\">\n            <div class=\"page-splash-message\">\n                Gulp Patterns Demo\n            </div>\n        </div>\n    </div>\n\n    <header class=\"clearfix\">\n        <div data-ng-include=\"\'app/layout/topnav.html\'\"></div>\n    </header>\n    <section id=\"content\" class=\"content\">\n        <div data-ng-include=\"\'app/layout/sidebar.html\'\"></div>\n\n        <div data-ng-view class=\"shuffle-animation\"></div>\n\n        <div ngplus-overlay\n             ngplus-overlay-delay-in=\"50\"\n             ngplus-overlay-delay-out=\"700\"\n             ngplus-overlay-animation=\"dissolve-animation\">\n            <img src=\"../../content/images/busy.gif\"/>\n\n            <div class=\"page-spinner-message overlay-message\">{{vm.busyMessage}}</div>\n        </div>\n    </section>\n</div>\n\n\n");
$templateCache.put("app/layout/sidebar.html","<div data-cc-sidebar when-done-animating=\"vm.sidebarReady()\" data-ng-controller=\"Sidebar as vm\">\n    <div class=\"sidebar-filler\"></div>\n    <div class=\"sidebar-dropdown\"><a href=\"#\">Menu</a></div>\n    <div class=\"sidebar-inner\">\n        <div class=\"sidebar-widget\"></div>\n        <ul class=\"navi\">\n            <li class=\"nlightblue fade-selection-animation\" data-ng-class=\"vm.isCurrent(r)\"\n                data-ng-repeat=\"r in vm.navRoutes\">\n                <a href=\"#{{r.originalPath}}\"\n                   data-ng-bind-html=\"r.settings.content\"></a>\n            </li>\n        </ul>\n    </div>\n</div>\n");
$templateCache.put("app/layout/topnav.html","<nav class=\"navbar navbar-fixed-top navbar-inverse\">\n    <div class=\"navbar-header\">\n        <a href=\"/\" class=\"navbar-brand\"><span class=\"brand-title\">{{vm.title}}</span></a>\n        <a class=\"btn navbar-btn navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-collapse\">\n            <span class=\"icon-bar\"></span>\n            <span class=\"icon-bar\"></span>\n            <span class=\"icon-bar\"></span>\n        </a>\n    </div>\n    <div class=\"navbar-collapse collapse\">\n        <div class=\"pull-right navbar-logo\">\n            <ul class=\"nav navbar-nav pull-right\">\n                <li>\n                    <a href=\"http://www.johnpapa.net/hottowel-angular\" target=\"_blank\">\n                        Created by John Papa\n                    </a>\n                </li>\n                <li class=\"dropdown dropdown-big\">\n                    <a href=\"http://www.angularjs.org\" target=\"_blank\">\n                        <img src=\"content/images/AngularJS-small.png\" />\n                    </a>\n                </li>\n                <li>\n                    <a href=\"http://www.gulpjs.com/\" target=\"_blank\">\n                        <img src=\"content/images/gulp-tiny.png\" />\n                    </a>\n                </li>\n            </ul>\n        </div>\n    </div>\n</nav>");
$templateCache.put("app/widgets/widgetheader.html","<div class=\"widget-head\">\n    <div class=\"page-title pull-left\">{{title}}</div>\n    <small class=\"page-title-subtle\" data-ng-show=\"subtitle\">({{subtitle}})</small>\n    <div class=\"widget-icons pull-right\" data-ng-if=\"allowCollapse\">\n        <a data-cc-widget-minimize></a>\n    </div>\n    <small class=\"pull-right page-title-subtle\" data-ng-show=\"rightText\">{{rightText}}</small>\n    <div class=\"clearfix\"></div>\n</div>");}]);