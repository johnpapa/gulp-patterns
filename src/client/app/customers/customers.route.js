(function() {
    'use strict';

    angular
        .module('app.customers')
        .run(appRun);

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

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
                        content: '<i class="fa fa-lock"></i> Customers'
                    }
                }
            }
        ];
    }
})();
