module.exports = function(app) {
    var api = '/api/';
    var data = '/../data/';
    var jsonfileservice = require('../utils/jsonfileservice')();
    var sql = require('mssql');
    var four0four = require('../utils/404')();
    var config = require('../config/db');

    app.get(api + 'customer/:id', getCustomer);
    app.get(api + 'customers', getCustomers);

    app.get(api + '*', four0four.notFoundMiddleware);

    function getCustomer(req, res, next) {
        var id = req.params.id;
        var msg = 'customer id ' + id + ' not found. ';
        sql.connect(config).then(pool => {
            // Store Procedure           
            
            return pool.request()
            .input('customerid', sql.Int, id)
            .execute('customers_sp')
            sql.close()
        }).then(result => {
            res.send(result.recordset);
            sql.close()
        }).catch(err => {
            // ... error checks
            console.log(err)
            sql.close()
        })
         
        sql.on('error', err => {
            console.log(err)
        })
    }

    function getCustomers(req, res, next) {
        sql.connect(config).then(pool => {
            // Store Procedure           
            
            return pool.request()
            .input('customerid', sql.Int, null)
            .execute('customers_sp')
            sql.close()
        }).then(result => {
            res.send(result.recordset);
            sql.close()
        }).catch(err => {
            // ... error checks
            console.log(err)
            sql.close()
        })
         
        sql.on('error', err => {
            console.log(err)
        })
    }

    function getCustomersv1(req, res, next) {
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
