module.exports = function(app) {
    var api = '/api/';
    var data = '/../data/';
    var jsonfileservice = require('../utils/jsonfileservice')();
    var four0four = require('../utils/404')();

    app.get(api + 'customer/:id', getCustomer);
    app.get(api + 'customers', getCustomers);

    app.get(api + '*', four0four.notFoundMiddleware);

    function getCustomer(req, res, next) {
        var id = req.params.id;
        var msg = 'customer id ' + id + ' not found. ';
        try {
            var json = jsonfileservice.getJsonFromFile(data + 'customers.json');
            var customer = json.filter(function(c) {
                return c.id === parseInt(id);
            });
            if (customer && customer[0]) {
                res.send(customer[0]);
            } else {
                four0four.send404(req, res, msg);
            }
        }
        catch (ex) {
            four0four.send404(req, res, msg + ex.message);
        }
    }

    function getCustomers(req, res, next) {
        var msg = 'customers not found. ';
        try {
            var json = jsonfileservice.getJsonFromFile(data + 'customers.json');
            if (json) {
                res.send(json);
            } else {
                four0four.send404(req, req, msg);
            }
        }
        catch (ex) {
            four0four.send404(req, res, msg + ex.message);
        }
    }
};
