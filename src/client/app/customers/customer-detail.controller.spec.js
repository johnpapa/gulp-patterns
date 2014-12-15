/* jshint -W117, -W030 */
describe('app.customers', function() {
    var controller;

    beforeEach(function() {
        module('app', function($provide) {
            specHelper.fakeStateProvider($provide);
            specHelper.fakeLogger($provide);
        });
        specHelper.injector(function($controller, $q, $rootScope, dataservice) {});
    });

    beforeEach(function () {
        stubs.dataservice.getCustomer($q, dataservice);
        stubs.dataservice.ready($q, dataservice);

        controller = $controller('CustomerDetail');
        $rootScope.$apply();
    });

    describe('CustomerDetail controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function() {
            it('should have title of Customer Detail', function() {
                expect(controller.title).to.equal('Customer Detail');
            });

            it('should have a Customer', function() {
                expect(controller.customer).to.be.defined;
            });

            it('should have a requested Customer', function() {
                var name = controller.customer.firstName + ' ' + controller.customer.lastName;
                expect(name).to.be.equal('Black Widow');
            });
        });
    });

    specHelper.verifyNoOutstandingHttpRequests();
});
