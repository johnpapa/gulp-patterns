/* jshint -W117, -W030 */
describe('app.customers', function() {
    var controller;

    beforeEach(function() {
        specHelper.appModule('app.customers');
        specHelper.injector('$controller', '$q', '$rootScope', 'dataservice');
    });

    beforeEach(function () {
        sinon.stub(dataservice, 'getCustomer').
            returns($q.when(mockData.blackWidow)).withArgs('1017109');

        sinon.stub(dataservice, 'ready').returns($q.when({test: 123}));

        controller = $controller('CustomerDetail');
        $rootScope.$apply();
    });

    specHelper.verifyNoOutstandingHttpRequests();

    describe('CustomerDetail controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function() {
            it('should have title of Customer Detail', function() {
                expect(controller.title).to.equal('Customer Detail');
            });

            it('should have a Customer', function() {
                expect(controller.customer).to.be.defined;
            });

            it('should have a requested Customer', function() {
                var name = controller.customer.firstName + ' ' + controller.customer.lastName;
                expect(name).to.be.equal('Black Widow');
            });
        });
    });

    specHelper.verifyNoOutstandingHttpRequests();
});
