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

router.post('/login', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  connection.query(
      "SELECT *, DATE_FORMAT(dob,'%Y %M %d') as birthday " +
      "FROM users " +
      "WHERE username = ? " +
        "AND password = ?",
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

router.post('/registration', function(req, res, next) {
    var user = req.body.user;
    var username = user.username;
    var password = user.password;
    var repassword = user.repassword;
    var email = user.email;
    var firstName = user.firstName;
    var lastName = user.lastName;
    var birthDay = user.birthDay;
    var gender = user.gender;
    var type = '1';//user.type;

    if(username === '' || password === '' || repassword === '' || email === ''
        || firstName === '' || lastName === '' || birthDay === ''
        || gender === '' || type === ''){
        res.send({ 'success': false, 'message': 'Please fill all mandatory field'});
    }else if(repassword !== password){
        res.send({ 'success': false, 'message': 'The re-password is mismatching'});
    }else {
        connection.query(
            "INSERT INTO users" +
                "(`username`, `email`, `firstName`, " +
                    "`lastName`, `dob`, `gender`, `type`, `password`)" +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
            [username, email, firstName, lastName, birthDay, gender, type, password],
            function (err, row, field) {
                if (err && err.toString().indexOf('username_UNIQUE') !== -1) {
                    console.log(err);
                    res.send({'success': false, 'message': 'This username is already in use. Please select another one.'})
                }else if(err){
                    console.log(err);
                    res.send({'success': false, 'message': 'Could not connect to database'})
                }else{
                    res.send({'success': true, 'user': user});
                }
            }
        );
    }

});

module.exports = router;
