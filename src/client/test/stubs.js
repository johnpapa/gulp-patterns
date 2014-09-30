/*jshint -W079 */
var stubs = (function() {
    var service = {
        dataservice: {
            getCustomer: dataservice_getCustomer,
            getCustomers: dataservice_getCustomers,
            ready: dataservice_ready
        }
    };
    return service;

    function dataservice_ready($q, dataservice) {
        sinon.stub(dataservice, 'ready', function() {
            var deferred = $q.defer();
            deferred.resolve({test: 123});
            return deferred.promise;
        });
    }

    function dataservice_getCustomer($q, dataservice) {
        sinon.stub(dataservice, 'getCustomer', function() {
            var deferred = $q.defer();
            deferred.resolve(mockData.blackWidow);
            return deferred.promise;
        }).withArgs('1017109');
    }

    function dataservice_getCustomers($q, dataservice) {
        sinon.stub(dataservice, 'getCustomers', function() {
            var deferred = $q.defer();
            deferred.resolve(mockData.getMockCustomers());
            return deferred.promise;
        });
    }
})();
