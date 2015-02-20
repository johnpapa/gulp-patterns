(function() {
    'use strict';

    angular
        .module('app.customers')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper, gettextCatalog) {
        routerHelper.configureStates(getStates());

        ///////////////////////////////

        function getStates() {
            return [
                {
                    state: 'customer',
                    config: {
                        abstract: true,
                        template: '<ui-view class="shuffle-animation"/>',
                        url: '/customer'
                    }
                },
                {
                    state: 'customer.list',
                    config: {
                        url: '/list',
                        templateUrl: 'app/customers/customers.html',
                        controller: 'Customers',
                        controllerAs: 'vm',
                        title: gettextCatalog.getString('Customers'),
                        settings: {
                            nav: 2,
                            content: '<i class="fa fa-group"></i> ' +
                                        gettextCatalog.getString('Customers')
                        }
                    }
                },
                {
                    state: 'customer.detail',
                    config: {
                        url: '/:id',
                        templateUrl: 'app/customers/customer-detail.html',
                        controller: 'CustomerDetail',
                        controllerAs: 'vm',
                        title: gettextCatalog.getString('Customer Detail')
                    }
                }
            ];
        }
    }

})();
