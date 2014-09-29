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
        sinon.stub(dataservice, 'getCustomer', function() {
            var deferred = $q.defer();
            deferred.resolve(mockData.getMockCustomers()[0]);
            return deferred.promise;
        }).withArgs('1017109');

        sinon.stub(dataservice, 'ready', function() {
            var deferred = $q.defer();
            deferred.resolve({test: 123});
            return deferred.promise;
        });

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