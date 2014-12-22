/* jshint -W117, -W030 */
describe('dashboard', function() {
    describe('state', function() {
        var controller;
        var view = 'app/dashboard/dashboard.html';

        beforeEach(function() {
            module('app.dashboard', bard.fakeToastr);
            bard.inject('$location', '$rootScope', '$state', '$templateCache');
            $templateCache.put(view, '');
        });

        it('should map / route to dashboard View template', function() {
            expect($state.get('dashboard').templateUrl).to.equal(view);
        });

        it('should map state dashboard to url / ', function() {
            expect($state.href('dashboard', {})).to.equal('/');
        });

        it('of dashboard should work with $state.go', function() {
            $state.go('dashboard');
            $rootScope.$apply();
            expect($state.is('dashboard'));
        });

        it('should route /invalid to the otherwise (dashboard) route', function() {
            $location.path('/invalid');
            $rootScope.$apply();
            expect($state.current.templateUrl).to.equal(view);
        });
    });
});
