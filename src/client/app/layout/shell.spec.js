/* jshint -W117, -W030 */
describe('Shell', function() {
    var controller;

    beforeEach(function() {
        module('app', function($provide) {
            specHelper.fakeStateProvider($provide);
            specHelper.fakeLogger($provide);
        });
        specHelper.injector(function($controller, $q, $rootScope, $timeout, dataservice) {});            
    });

    beforeEach(function () {
        // sinon.stub(dataservice, 'getCustomers', function () {
        //     var deferred = $q.defer();
        //     deferred.resolve(mockData.getMockCustomers());
        //     return deferred.promise;
        // });

        sinon.stub(dataservice, 'ready', function () {
            var deferred = $q.defer();
            deferred.resolve({test: 123});
            return deferred.promise;
        });
      
        controller = $controller('Shell');
        $rootScope.$apply();
    });

    describe('Shell controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        it('should show splash screen', function () {
            expect(controller.showSplash).to.be.true;
        });

        it('should hide splash screen after timeout', function (done) {
            $timeout(function() {
                expect(controller.showSplash).to.be.false;
                done();
            }, 1000);
            $timeout.flush();
        });
    });

    specHelper.verifyNoOutstandingHttpRequests();
});