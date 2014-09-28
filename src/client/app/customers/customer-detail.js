(function() {
    'use strict';

    angular
        .module('app.customers')
        .controller('CustomerDetail', CustomerDetail);

    /* @ngInject */
    function CustomerDetail($routeParams, dataservice, logger) {
        /*jshint validthis: true */
        var vm = this;
        vm.customer = undefined;
        vm.title = 'CustomerDetail';

        activate();

        function activate() {
            return getCustomer($routeParams.id).then(function() {
                logger.info('Activated Customer Detail View');
            });
        }

        function getCustomer(id) {
            return dataservice.getCustomer(id).then(function(data) {
                vm.customer = data;
                return vm.customer;
            });
        }
    }
})();