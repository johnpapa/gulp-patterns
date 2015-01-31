(function () {
    angular
        .module('app')
        .factory('passThroughs', passThroughs);

    passThroughs.$inject = ['$httpBackend'];
    /* @ngInject */
    function passThroughs($httpBackend) {
        var apiUrl = new RegExp(/api\//);
        var service = {
            registerAPIs: registerAPIs,
            registerCatchAlls: registerCatchAlls,
            registerTemplates: registerTemplates
        };

        return service;

        function registerCatchAlls() {
            registerTemplates();
            registerAPIs();
        }

        function registerTemplates() {
            var pattern = /\.html$/;
            $httpBackend.whenGET(pattern).passThrough();
        }

        function registerAPIs() {
//            $httpBackend.whenGET(apiUrl).passThrough();
            var url = new RegExp(apiUrl.source + /.*/);
            $httpBackend.whenGET(url).passThrough();
            $httpBackend.whenPOST(url).passThrough();
            $httpBackend.whenDELETE(url).passThrough();
            $httpBackend.whenPUT(url).passThrough();
        }
    }
})();
