var assert = require('assert');
var expect = require('chai').expect;
var calculateDueDate = require('../src/calculateDueDate');

describe('calculateDueDate function ', function () {

    it('should increment submit date with 1 business hour (same day)', function (done) {
        // Arrange
        var submitDate = new Date("2017-02-10 12:00");
        var expectedDate = new Date("2017-02-10 13:00");
        var turnaroundTime = 1;
        // Act
        var calculatedDate = calculateDueDate(submitDate, turnaroundTime);
        // Assert
        expect(calculatedDate).to.be.an('Date');
        expect(calculatedDate.getTime()).to.be.equal(expectedDate.getTime());
        done();
    });

    it('should increment submit date with 4 business hours (finish next day)', function (done) {
        // Arrange
        var submitDate = new Date("2017-02-08 16:00");
        var expectedDate = new Date("2017-02-09 12:00");
        var turnaroundTime = 4;
        // Act
        var calculatedDate = calculateDueDate(submitDate, turnaroundTime);
        // Assert
        expect(calculatedDate).to.be.an('Date');
        expect(calculatedDate.getTime()).to.be.equal(expectedDate.getTime());
        done();
    });

    it('should increment submit date with 8 business hours (finish next day same time)', function (done) {
        // Arrange
        var submitDate = new Date("2017-02-9 12:12");
        var expectedDate = new Date("2017-02-10 12:12");
        var turnaroundTime = 8;
        // Act
        var calculatedDate = calculateDueDate(submitDate, turnaroundTime);
        // Assert
        expect(calculatedDate).to.be.an('Date');
        expect(calculatedDate.getTime()).to.be.equal(expectedDate.getTime());
        done();
    });

    it('should increment submit date with 16 business hours (finish in two days same time)', function (done) {
        // Arrange
        var submitDate = new Date("2017-02-8 12:12");
        var expectedDate = new Date("2017-02-10 12:12");
        var turnaroundTime = 16;
        // Act
        var calculatedDate = calculateDueDate(submitDate, turnaroundTime);
        // Assert
        expect(calculatedDate).to.be.an('Date');
        expect(calculatedDate.getTime()).to.be.equal(expectedDate.getTime());
        done();
    });

    it('should increment submit date with 20 business hours (finish after weekend)', function (done) {
        // Arrange
        var submitDate = new Date("2017-02-10 13:12");
        var expectedDate = new Date("2017-02-15 09:12");
        var turnaroundTime = 20;
        // Act
        var calculatedDate = calculateDueDate(submitDate, turnaroundTime);
        // Assert
        expect(calculatedDate).to.be.an('Date');
        expect(calculatedDate.getTime()).to.be.equal(expectedDate.getTime());
        done();
    });

    it('should increment submit date with 8 business hours (finish next month)', function (done) {
        // Arrange
        var submitDate = new Date("2017-02-28 12:00");
        var expectedDate = new Date("2017-03-01 12:00");
        var turnaroundTime = 8;
        // Act
        var calculatedDate = calculateDueDate(submitDate, turnaroundTime);
        // Assert
        expect(calculatedDate).to.be.an('Date');
        expect(calculatedDate.getTime()).to.be.equal(expectedDate.getTime());
        done();
    });

    it('should increment submit date with 216 business hours (finish next month)', function (done) {
        // Arrange
        var submitDate = new Date("2017-01-02 10:00");
        var expectedDate = new Date("2017-02-08 10:00");
        var turnaroundTime = 216;
        // Act
        var calculatedDate = calculateDueDate(submitDate, turnaroundTime);
        // Assert
        expect(calculatedDate).to.be.an('Date');
        expect(calculatedDate.getTime()).to.be.equal(expectedDate.getTime());
        done();
    });

    it('should fail with undefined inputs', function (done) {
        // Arrange, Act, Assert
        expect(calculateDueDate).to.throw(TypeError);
        done();
    });

    it('should fail with out of working hours submit date', function (done) {
        // Arrange
        var submitDate = new Date("2017-02-9 23:00");
        var turnaroundTime = 8;
        // Act, Assert
        expect(function(){ calculateDueDate(submitDate, turnaroundTime) }).to.throw(RangeError);
        done();
    });

    it('should fail with not positive turnaround time', function (done) {
        // Arrange
        var submitDate = new Date("2017-02-9 10:00");
        var turnaroundTime = -1;
        // Act, Assert
        expect(function(){ calculateDueDate(submitDate, turnaroundTime) }).to.throw(RangeError);
        done();
    });

});