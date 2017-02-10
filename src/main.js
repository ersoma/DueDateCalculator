var calculateDueDate = require("./calculateDueDate");
var dateFormat = require('dateformat');

document.getElementById("calculateDueDate").addEventListener("submit", function (e) {
    // Get the dateToSubmit as a JS Date object
    var dateToSubmit_date = document.getElementById('submitDate_date').value;
    var dateToSubmit_hour = document.getElementById('submitDate_hour').value;
    var dateToSubmit_minute = document.getElementById('submitDate_minute').value;
    var dateToSubmit = new Date(dateToSubmit_date);
    dateToSubmit.setHours(dateToSubmit_hour);
    dateToSubmit.setMinutes(dateToSubmit_minute);

    // Get the turnaroundTime in hours
    var turnaroundTime = parseInt(document.getElementById('turnaroundTime').value, 10);

    // Calculate the due date
    try {
        var calculatedDueDate = calculateDueDate(dateToSubmit, turnaroundTime);
        document.getElementById("dueDate").value = dateFormat(calculatedDueDate, "yyyy-mm-dd HH:MM");
    } catch (err) {
        alert(err.message);
    }

    // Prevent the submition of the form
    e.preventDefault();
});