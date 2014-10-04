/* jshint -W117, -W030 */
describe('customers', function () {
    describe('state', function () {
        var controller;

        beforeEach(function() {
            module('app', specHelper.fakeLogger);
            specHelper.injector(function($httpBackend, $location, $rootScope, $state) {});
            $httpBackend.expectGET('app/customers/customers.html').respond(200);
        });

        it('should map state customers to url /customers ', function () {
            expect($state.href('customers', {})).to.equal('/customers');
        });

        it.only('should map state customer.detail to url /customer/:id ', function () {
            console.log($state.href('customer.detail'));
            // expect($state.href('.detail', {id: 7})).to.equal('/customer/7');
        });

        it('should map /customers route to customers View template', function () {
            expect($state.get('customers').templateUrl).
                to.equal('app/customers/customers.html');
        });

        it('should map /customer.details route to customers View template', function () {
            expect($state.get('customer.detail').templateUrl).
                to.equal('app/customers/customer-detail.html');
        });

        it('of customers should route to the customers View', function () {
            $state.go('customers');
            $rootScope.$apply();
            expect($state.current.templateUrl).to.equal('app/customers/customers.html');
        });
    });
});