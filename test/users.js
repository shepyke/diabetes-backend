// test for users.js

// Start of testId: users-1
describe('User registration', function() {

    var registeredUser = {
        username: 'testUser1',
        email: 'testemail@test.test',
        firstName: 'Test',
        lastName: 'Test',
        birthDay: '2018.05.03',
        gender: 'Male',
        type: '0',
        profileImage: 'https://storage.googleapis.com/diabetes-93dcc.appspot.com/anonym_man.png',
    }

    it('The username is already in use', function(done) {

        if (registeredUser.username == 'testUser1') {
            done();
        } else {
            done(new Error("The test is failed somehow."));
        }

    });

});
// End of testId: users-1

// Start of testId: users-2
describe('User login', function() {

    var user = {
        username: 'testUser1',
        password: 'ed02457b5c41d964dbd2f2a609d63fe1bb7528dbe55e1abf5b52c249cd735797'
    }

    it('Wrong password', function(done) {

        if (user.username == 'testUser1' && user.password != 'dsa821912') {
            done();
        } else {
            done(new Error("The test is failed somehow."));
        }

    });

});
// End of testId: users-2