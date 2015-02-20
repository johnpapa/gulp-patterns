(function () {
    'use strict';

    angular
        .module('app.customers')
        .controller('Customers', Customers);

    /* @ngInject */
    function Customers($state, dataservice, logger, gettextCatalog) {
        var vm = this;
        vm.customers = [];
        vm.gotoCustomer = gotoCustomer;
        vm.title = gettextCatalog.getString('Customers');

        activate();

        function activate() {
            return getCustomers().then(function () {
                logger.info(gettextCatalog.getString('Activated Customers View'));
            });
        }

        function getCustomers() {
            return dataservice.getCustomers().then(function (data) {
                vm.customers = data;
                return vm.customers;
            });
        }

        function gotoCustomer(c) {
            $state.go('customer.detail', {
                id: c.id
            });
        }
    }
})();
