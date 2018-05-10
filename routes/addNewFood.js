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

router.post('/', function(req, res, next) {
    var food = req.body.food;
    var foodName =  food.foodName;
    var barcode =  food.barcode;
    var glycemicIndex =  (food.glycemicIndex != '') ? food.glycemicIndex : -1;
    var carbohydrate =  (food.carbohydrate != '') ? food.carbohydrate : -1;
    var fat =  (food.fat != '') ? food.fat : -1;
    var calorie =  (food.calorie != '') ? food.calorie : -1;
    var protein=  (food.protein != '') ? food.protein : -1;
    var unit =  food.unit;
    var userId = req.body.userId;

    connection.query(
        "INSERT INTO `foods`" +
        "(`glycemicIndex`, `carbohydrate`, `fat`, `calorie`, `protein`, `barcode`, `foodName`, " +
        "`unit`, `registeredBy`)" +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);",
        [glycemicIndex, carbohydrate, fat, calorie, protein, barcode, foodName,unit, userId],
        function (err, row, field) {
            if (err && err.toString().indexOf('foodName_UNIQUE') !== -1) {
                console.log(err);
                res.send({'success': false, 'message': 'This food name is already in use. Please give another one.'})
            }else if(err){
                console.log(err);
                res.send({'success': false, 'message': 'Could not connect to database'})
            }else {
                food.foodId = row.insertId;
                res.send({'success': true, 'food': food});
            }
        }
    );
});

module.exports = router;
