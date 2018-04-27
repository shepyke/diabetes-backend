var express = require('express');
var router = express.Router();
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

var upload = multer({ storage: storage }).single('avatar');

router.post('/', function (req, res) {
    var message;
    var success;
    upload(req, res, function (err) {
        if (err) {
            message = "Something went wrong";
            success = false;
        }else{
            message = "Successfully uploaded a new profile photo";
            success = true;
        }
    })
    res.send({'success': success, 'message': message});
});

module.exports = router;