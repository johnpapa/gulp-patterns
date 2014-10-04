/* jshint -W117, -W030 */
describe('dashboard', function () {
    describe('state', function () {
        var controller;

        beforeEach(function() {
            module('app', specHelper.fakeLogger);
            specHelper.injector(function($httpBackend, $location, $rootScope, $state) {});            
            $httpBackend.expectGET('app/dashboard/dashboard.html').respond(200);
        });

        it('should map / route to dashboard View template', function () {
            expect($state.get('dashboard').templateUrl).
                to.equal('app/dashboard/dashboard.html');
        });

        it('should map state dashboard to url / ', function () {
            expect($state.href('dashboard', {})).to.equal('/');
        });

        it('should route / to the dashboard View', function () {
            expect($state.href('dashboard', {})).to.equal('/');
            $state.go('dashboard');
            $rootScope.$digest();
            expect($state.current.templateUrl).to.equal('app/dashboard/dashboard.html');
        });
    });
});