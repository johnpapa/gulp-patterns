/* jshint -W117, -W030 */
describe('Dashboard', function() {
    var controller;

    beforeEach(function() {
        bard.appModule('app.dashboard');
        bard.inject('$controller', '$q', '$rootScope', 'dataservice');
    });

    beforeEach(function() {
        sinon.stub(dataservice, 'getCustomers').
            returns($q.when(mockData.getMockCustomers()));

        controller = $controller('Dashboard');
        $rootScope.$apply();
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('Dashboard controller', function() {
        it('should be created successfully', function() {
            expect(controller).to.be.defined;
        });

        describe('after activate', function() {
            it('should have title of Dashboard', function() {
                expect(controller.title).to.equal('Dashboard');
            });

            it('should have at least 1 customer', function() {
                expect(controller.customers).to.have.length.above(0);
            });

            it('should have customer Count of 5', function() {
                expect(controller.customers).to.have.length(5);
            });
        });
    });
});
