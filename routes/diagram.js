var express = require('express');
var async = require('async');

var router = express.Router();

var mysql = require('mysql')

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'diabetes',
    timezone: 'utc',
    connectionLimit: 10
});

router.post('/getMeasurementData', function(req, res, next) {
    var userId = req.body.userId;
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;

    var query1 = "SELECT * FROM measurements WHERE userId = "
        + userId + " AND time > '" + fromDate + "' AND time < '" + toDate + "' ORDER BY time;";

    var query2 = "SELECT * FROM intakes WHERE userId = "
        + userId + " AND time > '" + fromDate + "' AND time < '" + toDate + "' ORDER BY time;";

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

router.post('/addMeasurement', function(req, res, next) {
    var diary = req.body.diary;
    var userId = diary.userId;
    var type = diary.type;
    var when = diary.when;
    var time = diary.time;
    var insulin = diary.insulin;
    var sugar = diary.sugar;

    if(insulin === '' || sugar === '' || time === ''){
        res.send({ 'success': false, 'message': 'Please fill all mandatory field'});
    }else {
        connection.query(
            "INSERT INTO measurements" +
            "(`userId`, `type`, `when`, `time`, `insulin`, `sugar`)" +
            "VALUES (?, ?, ?, ?, ?, ?);",
            [userId, type, when, time, insulin, sugar],
            function (err, row, field) {
                if (err) {
                    console.log(err);
                    res.send({'success': false, 'message': 'Could not connect to database'})
                } else {
                    res.send({'success': true, 'diary': diary});
                }
            }
        );
    }
});

router.post('/deleteMeasurement', function(req, res, next) {
    var measurementId = req.body.measurementId;
    console.log("measurementId: " + measurementId);

    connection.query(
        "DELETE FROM measurements WHERE measurementId = ? ",
        [measurementId],
        function(err, row, field){
            if(err){
                console.log(err);
                res.send({ 'success': false, 'message': 'Could not connect to database'})
            }

            console.log(row);

            if(row['affectedRows'] == '1'){
                res.send({ 'success': true, 'message': 'You have successfully deleted the measurement'});
            }else{
                res.send({ 'success': false, 'message': 'There werent any measurements with this id in your diary'});
            }
        }
    );
});

module.exports = router;
