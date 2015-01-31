(function () {
    angular.module('app')
        .config(configure)
        .run(registerStubs);

    //TODO: dynamically inject angular-mocks and stubs.js for dev stubbing mode only

    function configure($provide) {
        $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
    }

    function registerStubs($httpBackend) {
        if (false) {
            $httpBackend.when('GET', '/api/customers').respond(function (method, url, data) {
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
            }
            ];
                return [200, customers, {}];
            });

            $httpBackend.when('GET', /\/api\/customer\/\**/).respond(function (method, url, data) {
                return [200, {
                    'id': 8349812,
                    'firstName': 'Madalana',
                    'lastName': '',
                    'city': 'Wickedia',
                    'state': 'UK',
                    'zip': '81239',
                    'thumbnail': 'colleen_papa.jpg'
            }, {}];
            });
        }

        // Let all api calls pass through
        $httpBackend.whenGET(/api\//).passThrough();

        // Let all template calls pass through
        $httpBackend.whenGET(/\.html$/).passThrough();
    }
})();
