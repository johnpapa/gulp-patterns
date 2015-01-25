module.exports = function(app) {
    var api = '/api/';
    var data = '/../../data/';
    var jsonfileservice = require('./utils/jsonfileservice')();

    app.get(api + 'customer/:id', getCustomer);
    app.get(api + 'customers', getCustomers);

    app.get(api + '*', notFoundMiddleware);

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
                send404(req, res, msg);
            }
        }
        catch (ex) {
            send404(req, res, msg + ex.message);
        }
    }

    function getCustomers(req, res, next) {
        var msg = 'customers not found. ';
        try {
            var json = jsonfileservice.getJsonFromFile(data + 'customers.json');
            if (json) {
                res.send(json);
            } else {
                send404(req, req, msg);
            }
        }
        catch (ex) {
            send404(req, res, msg + ex.message);
        }
    }

    function notFoundMiddleware(req, res, next) {
        send404(req, res, 'API endpoint not found');
    }

    // helper function
    function send404(req, res, description) {
        var data = {
            status: 404,
            message: 'Not Found',
            description: description,
            url: req.url
        };
        res.status(404)
            .send(data)
            .end();
    }
};
