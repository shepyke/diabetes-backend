var express = require('express');

var router = express.Router();

var mysql = require('mysql')

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'diabetes'
});

router.post('/login', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  connection.query(
      "SELECT *, DATE_FORMAT(date_of_birth,'%Y %M %d') as birthdate FROM users WHERE username = ? AND password = ?",
      [username, password], function(err, row, field){
        if(err){
          console.log(err);
          res.send({ 'success': false, 'message': 'Could not connect to database'})
        }
        console.log(row[0]);
        if(row.length > 0){
          res.send({ 'success': true, 'user': row[0]});
        }else{
          res.send({ 'success': false, 'message': 'User not found'});
        }
      }
  );

});

module.exports = router;
