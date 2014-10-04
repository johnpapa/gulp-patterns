(function() {
    'use strict';

    angular
        .module('app.customers')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'customer',
                config: {
                    absract: true,
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
                    title: 'Customers',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-group"></i> Customers'
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
                    title: 'Customer Detail'
                }
            }
        ];
    }
})();
