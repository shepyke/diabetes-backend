//test for intakes.js
var request = require('supertest');
var app = require('../app.js');

//start of testId: intakes-1
describe('Intakes/foods page test', function () {

    it('responds to /intakes/foods', function testSlash(done) {
        request(app)
            .get('/intakes/foods')
            .expect(200, done);
    });

});
//end of testId: intakes-1

//start of testId: intakes-2
describe('Intakes/foods/beer page test', function () {

    it('404 not found', function testPath(done) {
        request(app)
            .get('/intakes/foods/beer')
            .expect(404, done);
    });

});
//end of testId: intakes-2
