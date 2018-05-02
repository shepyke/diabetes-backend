var express = require('express');
var async = require('async');

var router = express.Router();

var mysql = require('mysql')

var connection = mysql.createConnection({
    host: 'den1.mysql4.gear.host',
    user: 'diabetes',
    password: 'Zd1224II_4!u',
    database: 'diabetes',
    timezone: 'utc',
    connectionLimit: 10
});

router.post('/getMeasurementData', function(req, res, next) {
    var userId = req.body.userId;
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;

    var query1 = "SELECT * FROM measurements WHERE userId = "
        + userId + " AND time >= '" + fromDate + "' AND time <= '" + toDate + "' ORDER BY time;";

    var query2 = "SELECT * FROM intakes WHERE userId = "
        + userId + " AND time >= '" + fromDate + "' AND time <= '" + toDate + "' ORDER BY time;";

    var return_data = {};

    async.parallel([
        function(parallel_done) {
            connection.query(query1, {}, function(err, results) {
                if (err) return parallel_done(err);
                return_data.measurements = results;
                parallel_done();
            });
        },
        function(parallel_done) {
            connection.query(query2, {}, function(err, results) {
                if (err) return parallel_done(err);
                return_data.intakes = results;
                parallel_done();
            });
        }
    ], function(err) {
        if (err){
            console.log(err);
            res.send({ 'success': false, 'message': 'Could not connect to database'})
        }

        if(return_data != null){
            res.send({ 'success': true, 'measurements': return_data.measurements, 'intakes': return_data.intakes});
        }else{
            res.send({ 'success': false, 'message': 'There werent any data in your diary for this time period'});
        }
    });

});

module.exports = router;
