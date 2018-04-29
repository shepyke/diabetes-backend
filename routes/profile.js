var express = require('express');
var router = express.Router();
var multer = require('multer');
const imgUpload = require('../modules/imgUpload');

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

var upload = multer({
    storage: multer.MemoryStorage,
    fileSize: 5 * 1024 * 1024,
});

var mysql = require('mysql')

var connection = mysql.createConnection({
    host: 'den1.mysql4.gear.host',
    user: 'diabetes',
    password: 'Zd1224II_4!u',
    database: 'diabetes',
    timezone: 'utc'
});

router.post('/', upload.single('avatar'), imgUpload.uploadToGcs, function(request, response, next) {
    const data = request.body;
    if (request.file && request.file.cloudStoragePublicUrl) {
        var filePath = request.file.cloudStoragePublicUrl;
        var result = filePath.split("/");
        result = result[result.length-1].split("-");
        var userId = result[0];
        var query = "UPDATE users SET `profileImage` = '" + filePath
            + "' WHERE `userId` = '" + userId + "';";

        connection.query(query, {}, function (err, row, field) {
            if (err) {
                console.log(err);
                data.success = false;
                data.message = 'Something went wrong, please try again later'
            } else {
                data.success = true;
                data.profileImage = filePath;
                data.message = 'You have successfully uploaded a new profile photo';
            }
            response.send(data);
        });

    }else{
        data.success = false;
        data.message = 'Something went wrong, please try again later'
        response.send(data);
    }

});



module.exports = router;