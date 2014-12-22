/* jshint -W117, -W030 */
describe('app.customers', function() {
    var controller;
    var customers = mockData.getMockCustomers();
    var id = mockData.blackWidow.id;

    beforeEach(function() {
        bard.appModule('app.customers');
        bard.inject('$controller', '$log', '$q', '$rootScope', '$stateParams', 'dataservice');
    });

    beforeEach(function() {
        sinon.stub(dataservice, 'getCustomer')
            .returns($q.when(mockData.blackWidow))
            .withArgs(id);
        controller = $controller('CustomerDetail');
        $rootScope.$apply();
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('CustomerDetail controller', function() {
        it('should be created successfully', function() {
            expect(controller).to.be.defined;
        });

        describe('after activate', function() {
            describe('should have called dataservice.getCustomer', function() {
                beforeEach(function() {
                    $stateParams.id = id;
                });

                it('1 time', function() {
                    expect(dataservice.getCustomer).to.have.been.calledOnce;
                });

                it('with id ' + id, function() {
                    expect(dataservice.getCustomer).to.have.been.calledWith(id);
                });
            });

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

            it('should have logged "Activated"', function() {
                expect($log.info.logs).to.match(/Activated/);
            });
        });
    });
});
