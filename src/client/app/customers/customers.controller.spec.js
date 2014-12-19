/* jshint -W117, -W030 */
describe('app.customers', function() {
    var controller;
    var customers = mockData.getMockCustomers();

    beforeEach(function() {
        specHelper.appModule('app.customers');
        specHelper.injector('$controller', '$q', '$rootScope', 'dataservice');
    });

    beforeEach(function () {
        sinon.stub(dataservice, 'getCustomers').returns($q.when(customers));

        sinon.stub(dataservice, 'ready').
            returns($q.when({test: 123}));

        controller = $controller('Customers');
        $rootScope.$apply();
    });

    specHelper.verifyNoOutstandingHttpRequests();

    describe('Customers controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function() {
            it('should have title of Customers', function() {
                expect(controller.title).to.equal('Customers');
            });

            it('should have 5 Customers', function() {
                expect(controller.customers).to.have.length(5);
            });
        });
    });
});
