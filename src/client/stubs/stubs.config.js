(function () {

    if (!document.URL.match(/\?stubs$/)) {
        return;
    }

    console.log('* * * STUBBING with $httpBackend * * *');

    angular
        .module('app')
        .config(configure)
        .run(registerStubs);

    //TODO: dynamically inject angular-mocks and stubs.js for dev stubbing mode only

    configure.$inject = ['$provide'];
    /* @ngInject */
    function configure($provide) {
        $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
    }

    registerStubs.$inject = ['passThroughs', 'stubs'];
    /* @ngInject */
    function registerStubs(passThroughs, stubs) {
        if (true) {
            stubs.registerGetCustomers();
            stubs.registerGetCustomer();
            passThroughs.registerCatchAlls();
        }
    }
})();
