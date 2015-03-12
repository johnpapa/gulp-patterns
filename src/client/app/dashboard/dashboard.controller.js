(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('Dashboard', Dashboard);

    /* @ngInject */
    function Dashboard($state, dataservice, logger, gettextCatalog) {
        /* jshint validthis:true */
        var vm = this;
        vm.customers = [];
        vm.gotoCustomer = gotoCustomer;
        vm.title = gettextCatalog.getString('Dashboard');

        activate();

        function activate() {
            return getCustomers().then(function() {
                logger.info(gettextCatalog.getString('Activated Dashboard View'));
            });
        }

        function getCustomers() {
            return dataservice.getCustomers().then(function(data) {
                vm.customers = data;
                return vm.customers;
            });
        }

        function gotoCustomer(c) {
            $state.go('customer.detail', {id: c.id});
        }
    }
})();
