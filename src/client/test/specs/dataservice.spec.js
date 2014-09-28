/* global dataservice, */
describe('dataservice', function () {
    var scope;
    var mocks = {};

    beforeEach(function () {
        module('app', function($provide) {
            specHelper.fakeRouteProvider($provide);
            specHelper.fakeLogger($provide);
        });
        specHelper.injector(function($httpBackend, $q, $rootScope, dataservice) {});            
        
        sinon.stub(dataservice, 'getCustomers', function () {
            var deferred = $q.defer();
            deferred.resolve(mockData.getMockCustomers());
            return deferred.promise;
        });
    });

    it('should be registered', function() {
        expect(dataservice).not.to.equal(null);
    });

    describe('getCustomers function', function () {
        it('should exist', function () {
            expect(dataservice.getCustomers).not.to.equal(null);
        });
        
        it('should return 5 Customers', function (done) {
            dataservice.getCustomers().then(function(data) {
                expect(data.length).to.equal(5);
                done();
            });
            $rootScope.$apply();
        });

        it('should contain Black Widow', function (done) {
            // $httpBackend.when('GET', '/api/customers').respond(200, mocks.customers);
            dataservice.getCustomers().then(function(data) {
                var hasBlackWidow = data.some(function isPrime(element, index, array) {
                    return element.name.indexOf('Black Widow') >= 0;
                });
                expect(hasBlackWidow).to.be.true;
                done();
            });
            $rootScope.$apply();
        });
    });

    describe('ready function', function () {
        it('should exist', function () {
            expect(dataservice.ready).not.to.equal(null);
        });

        it('should return a resolved promise', function (done) {
            dataservice.ready()
                .then(function(data) {
                    expect(true).to.be.true;
                    done();
                }, function(data) {
                    expect('promise rejected').to.be.true;
                    done();
                });
            $rootScope.$apply();
        });
    });

    specHelper.verifyNoOutstandingHttpRequests();
});