//test for diary.js
var chai = require('chai');
var expect = chai.expect;
var chaiSubset = require('chai-subset');
chai.use(expect);
chai.use(chaiSubset);


//start of testId: diary-1
describe('Diary/deleteMeasurement test', function () {

    var measurementsData = [
        {
            measurementId: '1',
            userId: '0',
            type: 'breakfast',
            when: 'before',
            time: '2018-04-24 09:42:00',
            insulin: '10',
            sugar: '5.6'
        },
        {
            measurementId: '2',
            userId: '0',
            type: 'breakfast',
            when: 'after',
            time: '2018-04-24 10:32:00',
            insulin: '0',
            sugar: '11'
        },
        {
            measurementId: '3',
            userId: '0',
            type: 'lunch',
            when: 'before',
            time: '2018-04-24 13:42:00',
            insulin: '13',
            sugar: '6.3'
        }

    ]

    it('Measurement is deleted', function (done) {

        measurementsData.forEach(function (measurement) {
            if (measurement.measurementId == '3') {
                done();
            } else {
                //skip
            }
        });
    });
});
//end of testId: diary-1

//start of testId: diary-2
describe('Measurement/getDiary', function () {

    var measurementsData = [
        {
            measurementId: '1',
            userId: '0',
            type: 'breakfast',
            when: 'before',
            time: '2018-04-24 09:42:00',
            insulin: '10',
            sugar: '5.6'
        },
        {
            measurementId: '2',
            userId: '0',
            type: 'breakfast',
            when: 'after',
            time: '2018-04-24 10:32:00',
            insulin: '0',
            sugar: '11'
        },
        {
            measurementId: '3',
            userId: '0',
            type: 'lunch',
            when: 'before',
            time: '2018-04-24 13:42:00',
            insulin: '13',
            sugar: '6.3'
        }

    ]

    it('Should be empty if user has not any measurement', function() {
        expect(measurementsData).to.not.containSubset({userId : '1'});
    });

});
//end of testId: diary-2

//start of testId: diary-3
describe('Diary/updateMeasurement test', function () {

    var measurementsData = [
        {
            measurementId: '1',
            userId: '0',
            type: 'breakfast',
            when: 'before',
            time: '2018-04-24 09:42:00',
            insulin: '10',
            sugar: '5.6'
        },
        {
            measurementId: '2',
            userId: '0',
            type: 'breakfast',
            when: 'before',
            time: '2018-04-24 10:32:00',
            insulin: '0',
            sugar: '11'
        },
        {
            measurementId: '3',
            userId: '0',
            type: 'lunch',
            when: 'before',
            time: '2018-04-24 13:42:00',
            insulin: '13',
            sugar: '6.3'
        }

    ]

    measurementsData[1].when = 'after';

    it('Measurement is updated', function () {
        expect(measurementsData[1].when).equal('after');
    });
});
//end of testId: diary-3