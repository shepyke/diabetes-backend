var express = require('express');

var router = express.Router();

var mysql = require('mysql')

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'diabetes'
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

module.exports = router;
