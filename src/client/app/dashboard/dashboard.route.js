(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper, gettextCatalog) {
        routerHelper.configureStates(getStates());

        /////////////////////////////

        function getStates() {
            return [
                {
                    state: 'dashboard',
                    config: {
                        url: '/',
                        templateUrl: 'app/dashboard/dashboard.html',
                        controller: 'Dashboard',
                        controllerAs: 'vm',
                        title: gettextCatalog.getString('Dashboard'),
                        settings: {
                            nav: 1,
                            content: '<i class="fa fa-dashboard"></i> ' +
                                        gettextCatalog.getString('Dashboard')
                        }
                    }
                }
            ];
        }
    }

})();
