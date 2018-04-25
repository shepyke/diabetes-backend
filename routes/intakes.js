var express = require('express');

var router = express.Router();

var mysql = require('mysql')

var connection = mysql.createConnection({
    host: 'den1.mysql4.gear.host',
    user: 'diabetes',
    password: 'Zd1224II_4!u',
    database: 'diabetes',
    timezone: 'utc'
});

var foods;

router.get('/foods', function(req, res, next) {

    connection.query(
        "SELECT *" +
        "FROM foods",
        function(err, row, field){
            if(err){
                console.log(err);
                res.send({ 'success': false, 'message': 'Could not connect to database'})
            }

            if(row.length > 0){
                foods = row;
                res.send({ 'success': true, 'foods': row});
            }else{
                res.send({ 'success': false, 'message': 'There werent any food in the catalog'});
            }
        }
    );

});

router.post('/addIntake', function(req, res, next) {
    var intakes = req.body.intakes;
    var userId = req.body.userId;
    var time = req.body.time;

    var totalIntake = {
        avgGI: 0,
        totalCarbohydrate: 0,
        totalFat: 0,
        totalCalorie: 0,
        totalProtein: 0,
    };

    var finalFoodIds = '';
    var finalAmounts = '';

    if (intakes.length > 0) {
        for (var item of intakes) {
            totalIntake.avgGI += foods[item.foodId - 1].glycemicIndex;
            totalIntake.totalCarbohydrate += (foods[item.foodId - 1].carbohydrate * item.amount) / 100;
            totalIntake.totalFat += (foods[item.foodId - 1].fat * item.amount) / 100;
            totalIntake.totalCalorie += (foods[item.foodId - 1].calorie * item.amount) / 100;
            totalIntake.totalProtein += (foods[item.foodId - 1].protein * item.amount) / 100;
            finalFoodIds += item.foodId + ',';
            finalAmounts += item.amount + ',';
        }
        totalIntake.avgGI = totalIntake.avgGI / intakes.length;

        console.log("totalIntake: " + JSON.stringify(totalIntake,null,4));

        connection.query(
            "INSERT INTO intakes" +
            "(`userId`, `foodId`, `amount`, `time`, `glycemicIndex`, `totalCarbs`, " +
                "`totalFat`, `totalCalorie`, `totalProtein`) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);",
            [userId, finalFoodIds, finalAmounts, time, totalIntake.avgGI,
                totalIntake.totalCarbohydrate, totalIntake.totalFat,
                totalIntake.totalCalorie, totalIntake.totalProtein],
            function (err, row, field) {
                if (err) {
                    console.log(err);
                    res.send({'success': false, 'message': 'Could not connect to database'})
                } else {
                    res.send({'success': true, 'intake': totalIntake});
                }
            }
        );
    }
});

module.exports = router;
