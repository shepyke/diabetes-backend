var express = require('express');
var router = express.Router();
var multer = require('multer');

var filePath = 'https://diabetes-backend.herokuapp.com/uploads/';

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        filePath += file.originalname;
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage }).single('avatar');

var mysql = require('mysql')

var connection = mysql.createConnection({
    host: 'den1.mysql4.gear.host',
    user: 'diabetes',
    password: 'Zd1224II_4!u',
    database: 'diabetes',
    timezone: 'utc'
});

router.post('/', function (req, res, callback) {
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            return;
        }else{
            var result = filePath.split("/");
            result = result[result.length-1].split("-");
            var userId = result[0];
            var query = "UPDATE users SET `profileImage` = '" + filePath
                + "' WHERE `userId` = '" + userId + "';";

            connection.query(query, {}, function (err, row, field) {
                    if (err) {
                        console.log(err);
                        res.send({'success': false, 'message': 'Could not connect to database'})
                    } else {
                        res.send({'success': true, 'message': 'Successfully uploaded a new profile photo'});
                    }
                }
            );
        }
    })
});



module.exports = router;