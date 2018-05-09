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
    var hasUndefined = false;

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
            if(foods[item.foodId - 1].glycemicIndex === -1 || foods[item.foodId - 1].carbohydrate === -1
                || foods[item.foodId - 1].fat === -1 || foods[item.foodId - 1].calorie === -1
                || foods[item.foodId - 1].protein === -1){
                hasUndefined = true;
            }

            totalIntake.avgGI += (foods[item.foodId - 1].glycemicIndex !== -1) ? foods[item.foodId - 1].glycemicIndex : 0;
            totalIntake.totalCarbohydrate += (foods[item.foodId - 1].carbohydrate !== -1) ? (foods[item.foodId - 1].carbohydrate * item.amount) / 100 : 0;
            totalIntake.totalFat += (foods[item.foodId - 1].fat !== -1) ? (foods[item.foodId - 1].fat * item.amount) / 100 : 0;
            totalIntake.totalCalorie += (foods[item.foodId - 1].calorie !== -1) ? (foods[item.foodId - 1].calorie * item.amount) / 100 : 0;
            totalIntake.totalProtein += (foods[item.foodId - 1].protein !== -1) ? (foods[item.foodId - 1].protein * item.amount) / 100 : 0;
            finalFoodIds += item.foodId + ',';
            finalAmounts += item.amount + ',';
        }

        totalIntake.avgGI = precisionRound(totalIntake.avgGI / intakes.length, 1);
        totalIntake.totalCarbohydrate = precisionRound(totalIntake.totalCarbohydrate, 2);
        totalIntake.totalFat = precisionRound(totalIntake.totalFat, 2);
        totalIntake.totalCalorie = precisionRound(totalIntake.totalCalorie, 2);
        totalIntake.totalProtein = precisionRound(totalIntake.totalProtein, 2);

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
                    res.send({'success': true, 'intake': totalIntake, 'hasUndefined': hasUndefined});
                }
            }
        );
    }
});

function precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

module.exports = router;
