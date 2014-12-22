/* jshint -W117, -W030 */
describe('Shell', function() {
    var controller;

    beforeEach(function() {
        bard.appModule('app.layout');
        bard.inject('$controller', '$rootScope', '$timeout');
    });

    beforeEach(function() {
        controller = $controller('Shell');
        $rootScope.$apply();
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('Shell controller', function() {
        it('should be created successfully', function() {
            expect(controller).to.be.defined;
        });

        it('should show splash screen', function() {
            expect(controller.showSplash).to.be.true;
        });

        it('should hide splash screen after timeout', function(done) {
            $timeout(function() {
                expect(controller.showSplash).to.be.false;
                done();
            }, 1000);
            $timeout.flush();
        });
    });
});
