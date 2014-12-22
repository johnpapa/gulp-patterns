/* jshint -W117, -W030 */
describe('app.customers', function() {
    var controller;
    var customers = mockData.getMockCustomers();

    beforeEach(function() {
        bard.appModule('app.customers');
        bard.inject('$controller', '$log',  '$q', '$rootScope', 'dataservice');
    });

    beforeEach(function() {
        sinon.stub(dataservice, 'getCustomers').returns($q.when(customers));
        controller = $controller('Customers');
        $rootScope.$apply();
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('Customers controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function() {
            it('should have called dataservice.getCustomers 1 time', function () {
                expect(dataservice.getCustomers).to.have.been.calledOnce;
            });

            it('should have title of Customers', function() {
                expect(controller.title).to.equal('Customers');
            });

            it('should have 5 Customers', function() {
                expect(controller.customers).to.have.length(5);
            });

            it('should have logged "Activated"', function() {
                expect($log.info.logs).to.match(/Activated/);
            });
        });
    });
});
