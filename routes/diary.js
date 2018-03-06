var express = require('express');

var router = express.Router();

var mysql = require('mysql')

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'diabetes'
});

router.post('/getDiary', function(req, res, next) {
    var userId = req.body.userId;
    var time = req.body.time;

    connection.query(
        "SELECT * " +
        "FROM measurements " +
        "WHERE userId = ? " +
        "AND DAY(?) = DAY(NOW()) " +
        "AND MONTH(?) = MONTH(NOW()) " +
        "AND YEAR(?) = YEAR(NOW())",
        [userId, time, time, time],
        function(err, row, field){
            if(err){
                console.log(err);
                res.send({ 'success': false, 'message': 'Could not connect to database'})
            }

            console.log(row);

            if(row.length > 0){
                res.send({ 'success': true, 'diary': row});
            }else{
                res.send({ 'success': false, 'message': 'There werent any measurements in your diary'});
            }
        }
    );

});

router.post('/addMeasurement', function(req, res, next) {


});

module.exports = router;
