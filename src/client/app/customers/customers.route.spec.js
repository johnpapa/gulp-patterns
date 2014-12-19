/* jshint -W117, -W030 */
describe('customers', function () {
    describe('state', function () {
        var controller;

        beforeEach(function() {
            module('app.customers', specHelper.fakeLogger);
            specHelper.injector('$httpBackend', '$location', '$rootScope', '$state');
            $httpBackend.expectGET('app/customers/customers.html').respond(200);
        });

        it('should map state customer.list to url /customer/list ', function () {
            expect($state.href('customer.list', {})).to.equal('/customer/list');
        });

        it('should map state customer.detail to url /customer/:id ', function () {
            expect($state.href('customer.detail', {id: 7})).to.equal('/customer/7');
        });

        it('should map /customers route to customers View template', function () {
            expect($state.get('customer.list').templateUrl).
                to.equal('app/customers/customers.html');
        });

        it('should map /customer.details route to customers View template', function () {
            expect($state.get('customer.detail').templateUrl).
                to.equal('app/customers/customer-detail.html');
        });

        it('of customer.list should work with $state.go', function () {
            $httpBackend.expectGET('app/dashboard/dashboard.html').respond(200);
            $state.go('customer.list');
            $rootScope.$apply();
            expect($state.is('customer.list'));
        });
    });
});
