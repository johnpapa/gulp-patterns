module.exports = function(app) {
    var jsonfileservice = require('./utils/jsonfileservice')();
    var pkg = require('./../../../package.json');

    app.get(pkg.paths.api + '/customers', getCustomers);

    function getCustomers(req, res, next) {
        var json = jsonfileservice.getJsonFromFile(pkg.paths.data + 'customers.json');
        res.send(json);
    }
};