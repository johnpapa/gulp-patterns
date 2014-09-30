/* jshint -W117, -W030 */
describe('Dashboard', function() {
    var controller;

    beforeEach(function() {
        module('app', function($provide) {
            specHelper.fakeRouteProvider($provide);
            specHelper.fakeLogger($provide);
        });
        specHelper.injector(function($controller, $q, $rootScope, dataservice) {});            
    });

    beforeEach(function () {
        sinon.stub(dataservice, 'getCustomers', function () {
            var deferred = $q.defer();
            deferred.resolve(mockData.getMockCustomers());
            return deferred.promise;
        });

        sinon.stub(dataservice, 'ready', function () {
            var deferred = $q.defer();
            deferred.resolve({test: 123});
            return deferred.promise;
        });
      
        controller = $controller('Dashboard');
        $rootScope.$apply();
    });

    describe('Dashboard controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function() {
            it('should have title of Dashboard', function () {
                expect(controller.title).to.equal('Dashboard');
            });

            it('should have news', function () {
                expect(controller.news).to.not.be.empty;
            });

            it('should have at least 1 customer', function () {
                expect(controller.customers).to.have.length.above(0);
            });

            it('should have customer Count of 5', function () {
                expect(controller.customers).to.have.length(5);
            });
        });
    });

    specHelper.verifyNoOutstandingHttpRequests();
});