describe('customers', function () {
    describe('route', function () {
        var controller;

        beforeEach(function() {
            module('app', specHelper.fakeLogger);
            specHelper.injector(function($httpBackend, $location, $rootScope, $route) {});
            $httpBackend.expectGET('app/customers/customers.html').respond(200);
        });

        it('should map /customers route to customers View template', function () {
            expect($route.routes['/customers'].templateUrl).
                to.equal('app/customers/customers.html');
        });

        it('should route / to the customers View', function () {
            $location.path('/customers');
            $rootScope.$apply();
            expect($route.current.templateUrl).to.equal('app/customers/customers.html');
        });
    });
});