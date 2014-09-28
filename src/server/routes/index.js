module.exports = function(app) {
    var jsonfileservice = require('./utils/jsonfileservice')();
    var pkg = require('./../../../package.json');

    app.get(pkg.paths.api + '/customer/:id', getCustomer);
    app.get(pkg.paths.api + '/customers', getCustomers);

    function getCustomer(req, res, next) {
        var json = jsonfileservice.getJsonFromFile(pkg.paths.data + 'customers.json');
        var customer = json.filter(function(c) {
            return c.id == req.params.id; // num and string
        });
        res.send(customer[0]);
    }

    function getCustomers(req, res, next) {
        var json = jsonfileservice.getJsonFromFile(pkg.paths.data + 'customers.json');
        res.send(json);
    }
};