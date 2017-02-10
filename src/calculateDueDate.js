/**
 * The program reads the submit date and turnaround time as an input
 * and returns the date and time when the issue is to be resolved.
 * 
 * @author Soma Erdélyi <info@somaerdelyi.net>
 * @throws {TypeError} if submitDate or turnaroundTime is not defined
 * @throws {RangeError} if submitDate is not between working hours or turnaroundTime is not positive
 * @param {Date} submitDate The starting date of the calculation
 * @param {Number} turnaroundTime The turnaround time in hours
 */
module.exports = function (submitDate, turnaroundTime) {

    var workLimits = (function () {
        var weekendDays = [6, 0];
        var workStartHour = 9;
        var workEndHour = 17;
        var workDayHours = workEndHour - workStartHour;
        var workWeekHours = (7 - weekendDays.length) * workDayHours;
        return {
            WEEKEND_DAYS: weekendDays,
            WORK_START_HOUR: workStartHour,
            WORK_END_HOUR: workEndHour,
            WORKDAY_HOURS: workDayHours,
            WORKWEEK_HOURS: workWeekHours
        }
    })();
    var errorMessages = {
        SUBMIT_DATE_UNDEFINED: "Date of submittion is not defined",
        SUBMIT_DATE_NOT_DATE: "Date of submittion is not a date",
        TURNAROUND_TIME_NOT_NUMBER: "Turnaround time is not a number",
        SUBMIT_DATE_NOT_WORKING_HOUR: "Date of submittion is not between working hours",
        TURNAROUND_TIME_NOT_POSITIVE: "Turnaround time is not positive"
    }

    /**
     * Returns true if input is not on weekend and is between working hours
     * @param {Date} dateToCheck
     */
    function isDateBetweenWorkingHours(dateToCheck) {
        var isWeekend = workLimits.WEEKEND_DAYS.indexOf(dateToCheck.getDay()) > -1;
        var isAfterWorkStart = workLimits.WORK_START_HOUR <= dateToCheck.getHours();
        var endDate = new Date(dateToCheck);
        endDate.setHours(workLimits.WORK_END_HOUR);
        endDate.setMinutes(0);
        endDate.setSeconds(0);
        endDate.setMilliseconds(0);
        var isBeforeWorkEnd = dateToCheck <= endDate;
        return isWeekend === false && isAfterWorkStart && isBeforeWorkEnd;
    }

    /**
     * Calculate the extra days that has to be added because of the weekends
     * @param {Number} fullDays
     * @param {Number} startDay
     */
    function calculateExtraDays(fullDays, startDay) {
        var extraDays = 0;
        while (fullDays !== 0) {
            if (workLimits.WEEKEND_DAYS.indexOf((startDay + 1) % 7) > -1) {
                extraDays++;
            } else {
                fullDays--;
            }
            startDay++;
        }
        return extraDays;
    }

    /**
     * Validate inputs:
     * 1. submitDateToValidate must be defined and a date
     * 2. turnaroundTimeToValidate must be defined and a number
     * 3. submitDateToValidate must be between working hours
     * 4. turnaroundTimeToValidate must be positive
     * @throws {TypeError} if submitDate or turnaroundTime is not defined
     * @throws {RangeError} if submitDate is not between working hours or turnaroundTime is not positive
     * @param {Date} submitDateToValidate
     * @param {Number} turnaroundTimeToValidate
     */
    function validateInputs(submitDateToValidate, turnaroundTimeToValidate) {
        // 1.
        if (typeof submitDateToValidate === "undefined") {
            throw new TypeError(errorMessages.SUBMIT_DATE_UNDEFINED);
        }
        if (submitDateToValidate instanceof Date === false) {
            throw new TypeError(errorMessages.SUBMIT_DATE_NOT_DATE);
        }
        // 2.
        if (typeof turnaroundTimeToValidate !== "number") {
            throw new TypeError(errorMessages.TURNAROUND_TIME_NOT_NUMBER);
        }
        // 3.
        if (isDateBetweenWorkingHours(submitDateToValidate) === false) {
            throw new RangeError(errorMessages.SUBMIT_DATE_NOT_WORKING_HOUR);
        }
        // 4.
        if (turnaroundTimeToValidate < 1) {
            throw new RangeError(errorMessages.TURNAROUND_TIME_NOT_POSITIVE);
        }
    }

    /**
     * 1. Get the full weeks that has to be added and the remaining hours
     * 2. Get the full days that has to be added and the remaining minutes
     * 3. Calculate the remaining minutes until business hours end on the day of submittion
     * 4. Calculate the extra days that has to be added because of the weekends
     * 5. If remaining time is more than the time until the end of work add an extra day
     * 6. Sum all the parts in minutes, update the submit date and return
     * @param {Date} _submitDate
     * @param {Number} _turnaroundTime
     */
    function getDueDate(_submitDate, _turnaroundTime) {
        var resultDate = new Date(_submitDate);
        // 1.
        var fullWeeks = parseInt(_turnaroundTime / workLimits.WORKWEEK_HOURS, 10);
        var remaningHours = _turnaroundTime % workLimits.WORKWEEK_HOURS;

        // 2.
        var fullDays = parseInt(remaningHours / workLimits.WORKDAY_HOURS, 10);
        var remaningMinutes = (remaningHours % workLimits.WORKDAY_HOURS) * 60;

        // 3.
        var remainingMinutesThatDay = (workLimits.WORK_END_HOUR * 60) -
            (_submitDate.getHours() * 60 + _submitDate.getMinutes());

        // 4.
        var inputDays = fullDays;
        inputDays += remainingMinutesThatDay < remaningMinutes ? 1 : 0;
        var extraDays = calculateExtraDays(inputDays, _submitDate.getDay());

        // 5.
        if (remainingMinutesThatDay < remaningMinutes) {
            remaningMinutes += (24 - workLimits.WORKDAY_HOURS) * 60;
        }

        // 6.
        var fullWeeksInMinutes = fullWeeks * 24 * 7 * 60;
        var fullDaysInMinutes = fullDays * 24 * 60;
        var extraDaysInMinutes = extraDays * 24 * 60;
        var sumInMinutes = fullWeeksInMinutes + fullDaysInMinutes + extraDaysInMinutes + remaningMinutes;
        resultDate.setMinutes(_submitDate.getMinutes() + sumInMinutes);
        return resultDate;
    }

    // 1. Validate inputs
    validateInputs(submitDate, turnaroundTime);
    // 2. Calculate and return the result date
    return getDueDate(submitDate, turnaroundTime);
}