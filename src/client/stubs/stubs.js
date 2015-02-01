(function () {
    angular
        .module('app')
        .factory('stubs', stubs);

    stubs.$inject = ['$httpBackend'];
    /* @ngInject */
    function stubs($httpBackend) {
        var apiUrl = new RegExp(/api\//);
        var service = {
            registerAll: registerAll,
            registerGetCustomer: registerGetCustomer,
            registerGetCustomers: registerGetCustomers
        };

        return service;

        function registerAll() {
            registerGetCustomers();
            registerGetCustomer();
        }

        function registerGetCustomers() {
            var pattern = new RegExp(apiUrl.source + 'customers');
            $httpBackend.whenGET(pattern).respond(getCustomersCallback);

            function getCustomersCallback(method, url, data) {
                var customers = [
                    {
                        'id': 8349812,
                        'firstName': 'Madalana',
                        'lastName': '',
                        'city': 'Wickedia',
                        'state': 'UK',
                        'zip': '81239',
                        'thumbnail': 'colleen_papa.jpg'
                    },
                    {
                        'id': 2387872,
                        'firstName': 'Galavant',
                        'lastName': '',
                        'city': 'Medievalia',
                        'state': 'UK',
                        'zip': '82828',
                        'thumbnail': 'john_papa.jpg'
                    }];
                return [200, customers, {}];
            }
        }

        function registerGetCustomer(id) {
            var pattern = new RegExp(apiUrl.source + /customer\/\**/.source);
            $httpBackend.whenGET(pattern).respond(getCustomerCallback);

            function getCustomerCallback(method, url, data) {
                var customer = {
                    'id': 8349812,
                    'firstName': 'Madalana',
                    'lastName': '',
                    'city': 'Wickedia',
                    'state': 'UK',
                    'zip': '81239',
                    'thumbnail': 'colleen_papa.jpg'
                };
                return [200, customer, {}];
            }
        }
    }
})();
