// test for profile-1

var request = require('supertest');
var app = require('../app.js');
var fs = require('fs');

// Start of testId: profile-1
describe('New Profile photo', function () {
    it('Successful', function(done) {
        var userId = 0;
        request(app)
            .post('/profile')
            .set('Content-Type', 'multipart/form-data;')
            .write('filename="'+(userId + '-' + new Date()) + '"\r\n', fs.readFileSync('./public/images/test.jpeg'))
        done()
    });
});
// End of testId: profile-1