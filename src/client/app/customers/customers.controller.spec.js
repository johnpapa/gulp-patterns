/* jshint -W117, -W030 */
describe('app.customers', function() {
    var controller;
    var customers = mockData.getMockCustomers();
    var spies = {};

    beforeEach(function() {
        specHelper.appModule('app.customers');
        specHelper.injector('$controller', '$q', '$rootScope', 'dataservice');

        spies.getCustomers = sinon.stub(dataservice, 'getCustomers').returns($q.when(customers));
        controller = $controller('Customers');
        $rootScope.$apply();
    });

    afterEach(function(){
        spies = {};
    });

    specHelper.verifyNoOutstandingHttpRequests();

    describe('Customers controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function() {
            it('should have called dataservice.getCustomers 1 time', function () {
                expect(spies.getCustomers).to.have.been.calledOnce;
            });

            it('should have title of Customers', function() {
                expect(controller.title).to.equal('Customers');
            });

            it('should have 5 Customers', function() {
                expect(controller.customers).to.have.length(5);
            });
        });
    });
});
