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

router.get('/foods', function(req, res, next) {

    connection.query(
        "SELECT *" +
        "FROM foods",
        function(err, row, field){
            if(err){
                console.log(err);
                res.send({ 'success': false, 'message': 'Could not connect to database'})
            }

            console.log(row);

            if(row.length > 0){
                res.send({ 'success': true, 'foods': row});
            }else{
                res.send({ 'success': false, 'message': 'There werent any food in the catalog'});
            }
        }
    );

});

router.post('/addIntake', function(req, res, next) {
    var intake = req.body.intake;
    var userId = intake.userId;
    var foodId = intake.foodId;
    var amount = intake.amount;
    var time = intake.time;

    var food = req.body.food;
    var glycemicIndex = food.glycemicIndex;
    var totalCarbohydrate = (food.carbohydrate * amount);
    var totalFat = (food.fat * amount);
    var totalCalorie = (food.calorie * amount);
    var totalProtein = (food.protein * amount);

    if(amount === '' || time === ''){
        res.send({ 'success': false, 'message': 'Please fill all mandatory field'});
    }else {
        connection.query(
            "INSERT INTO intakes" +
            "(`userId`, `foodId`, `amount`, `time`, `glycemicIndex`, `totalCarbs`, `totalFat`, `totalCalorie`, `totalProtein`) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);",
            [userId, foodId, amount, time, glycemicIndex, totalCarbohydrate, totalFat, totalCalorie, totalProtein],
            function (err, row, field) {
                if(err){
                    console.log(err);
                    res.send({'success': false, 'message': 'Could not connect to database'})
                }else{
                    res.send({'success': true, 'intake': intake});
                }
            }
        );
    }

});

module.exports = router;
