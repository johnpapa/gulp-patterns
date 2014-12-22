/* jshint -W117, -W030 */
describe('customers', function() {
    describe('state', function() {
        var controller;
        var views = {
            customers: 'app/customers/customers.html',
            customerdetail: 'app/customers/customer-detail.html'
        };

        beforeEach(function() {
            module('app.customers', bard.fakeToastr);
            bard.inject('$location', '$rootScope', '$state', '$templateCache');
        });

        beforeEach(function() {
            $templateCache.put(views.customers, '');
            $templateCache.put(views.customerdetail, '');
        });

        it('should map state customer.list to url /customer/list ', function() {
            expect($state.href('customer.list', {})).to.equal('/customer/list');
        });

        it('should map state customer.detail to url /customer/:id ', function() {
            expect($state.href('customer.detail', {id: 7})).to.equal('/customer/7');
        });

        it('should map /customers route to customers View template', function() {
            expect($state.get('customer.list').templateUrl).to.equal(views.customers);
        });

        it('should map /customer.details route to customers View template', function() {
            expect($state.get('customer.detail').templateUrl).to.equal(views.customerdetail);
        });

        it('of customer.list should work with $state.go', function() {
            $state.go('customer.list');
            $rootScope.$apply();
            expect($state.is('customer.list'));
        });
    });
});
