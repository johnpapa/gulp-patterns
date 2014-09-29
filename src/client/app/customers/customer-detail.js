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
            return vm.firstName + ' ' + vm.lastName;
        }

        function save() {
            vm.original = angular.copy(vm.customer);
            logger.success('Saving Customer (not really)');
        }
    }
})();