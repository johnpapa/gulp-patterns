/* global dataservice, */
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
        sinon.stub(dataservice, 'getCustomers', function() {
            var deferred = $q.defer();
            deferred.resolve(mockData.getMockCustomers());
            return deferred.promise;
        });

        sinon.stub(dataservice, 'ready', function() {
            var deferred = $q.defer();
            deferred.resolve({test: 123});
            return deferred.promise;
        });

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