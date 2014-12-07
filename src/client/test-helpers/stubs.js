/* jshint -W117, -W030 */
var stubs = (function() {
    var service = {
        dataservice: {
            getCustomer: getCustomer,
            getCustomers: getCustomers,
            ready: ready
        }
    };
    return service;

    function ready($q, dataservice) {
        sinon.stub(dataservice, 'ready', function() {
            var deferred = $q.defer();
            deferred.resolve({test: 123});
            return deferred.promise;
        });
    }

    function getCustomer($q, dataservice) {
        sinon.stub(dataservice, 'getCustomer', function() {
            var deferred = $q.defer();
            deferred.resolve(mockData.blackWidow);
            return deferred.promise;
        }).withArgs('1017109');
    }

    function getCustomers($q, dataservice) {
        sinon.stub(dataservice, 'getCustomers', function() {
            var deferred = $q.defer();
            deferred.resolve(mockData.getMockCustomers());
            return deferred.promise;
        });
    }
})();
