/* jshint -W117, -W030 */
describe('app.customers', function() {
    var controller;

    beforeEach(function() {
        module('app', function($provide) {
            specHelper.fakeRouteProvider($provide);
            specHelper.fakeLogger($provide);
        });
        specHelper.injector(function($controller, $q, $rootScope, dataservice) {});
    });

    beforeEach(function () {
        stubs.dataservice.getCustomers($q, dataservice);
        stubs.dataservice.ready($q, dataservice);

        controller = $controller('Customers');
        $rootScope.$apply();
    });

    describe('Customers controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function() {
            it('should have title of Customers', function() {
                expect(controller.title).to.equal('Customers');
            });

            it('should have 5 Customers', function() {
                expect(controller.customers).to.have.length(5);
            });
        });
    });

    specHelper.verifyNoOutstandingHttpRequests();
});