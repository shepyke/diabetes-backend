var express = require('express');

var router = express.Router();

var mysql = require('mysql')

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'diabetes',
    timezone: 'utc'
});

router.post('/getDiary', function(req, res, next) {
    var userId = req.body.userId;
    var time = req.body.time;
    console.log("userId: " + userId);
    console.log("time: " + time);

    connection.query(
        "SELECT * " +
        "FROM measurements " +
        "WHERE userId = ? " +
        "AND DAY(time) = DAY(?) " +
        "AND MONTH(time) = MONTH(?) " +
        "AND YEAR(time) = YEAR(?) " +
        "ORDER BY time",
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

router.post('/updateMeasurement', function(req, res, next) {
    var diary = req.body.diary;
    var measurementId = diary.measurementId;
    var type = diary.type;
    var when = diary.when;
    var time = diary.time;
    var insulin = diary.insulin;
    var sugar = diary.sugar;

    console.log("updateDiary: " + JSON.stringify(diary,null,4));

    var query = "UPDATE measurements SET `type` = '" + type + "', `when` = '" + when +
        "', `time` = '" + time + "', `insulin` = '" + insulin + "', `sugar` = '" + sugar +
        "' WHERE `measurementId` = '" + measurementId + "';";

    if(insulin === '' || sugar === '' || time === ''){
        res.send({ 'success': false, 'message': 'Please fill all mandatory field'});
    }else {
        connection.query(query, {}, function (err, row, field) {
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
