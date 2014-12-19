/* jshint -W117, -W030 */
describe('Dashboard', function() {
    var controller;

    beforeEach(function() {
        specHelper.appModule('app.dashboard');
        specHelper.injector('$controller', '$q', '$rootScope', 'dataservice');
    });

    beforeEach(function () {
        sinon.stub(dataservice, 'getCustomers').
            returns($q.when(mockData.getMockCustomers()));

        sinon.stub(dataservice, 'ready').
            returns($q.when({test: 123}));

        controller = $controller('Dashboard');
        $rootScope.$apply();
    });

    specHelper.verifyNoOutstandingHttpRequests();

    describe('Dashboard controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function() {
            it('should have title of Dashboard', function () {
                expect(controller.title).to.equal('Dashboard');
            });

            it('should have at least 1 customer', function () {
                expect(controller.customers).to.have.length.above(0);
            });

            it('should have customer Count of 5', function () {
                expect(controller.customers).to.have.length(5);
            });
        });
    });
});
