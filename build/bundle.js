(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

(function(global) {
  'use strict';

  var dateFormat = (function() {
      var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZWN]|'[^']*'|'[^']*'/g;
      var timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
      var timezoneClip = /[^-+\dA-Z]/g;
  
      // Regexes and supporting functions are cached through closure
      return function (date, mask, utc, gmt) {
  
        // You can't provide utc if you skip other args (use the 'UTC:' mask prefix)
        if (arguments.length === 1 && kindOf(date) === 'string' && !/\d/.test(date)) {
          mask = date;
          date = undefined;
        }
  
        date = date || new Date;
  
        if(!(date instanceof Date)) {
          date = new Date(date);
        }
  
        if (isNaN(date)) {
          throw TypeError('Invalid date');
        }
  
        mask = String(dateFormat.masks[mask] || mask || dateFormat.masks['default']);
  
        // Allow setting the utc/gmt argument via the mask
        var maskSlice = mask.slice(0, 4);
        if (maskSlice === 'UTC:' || maskSlice === 'GMT:') {
          mask = mask.slice(4);
          utc = true;
          if (maskSlice === 'GMT:') {
            gmt = true;
          }
        }
  
        var _ = utc ? 'getUTC' : 'get';
        var d = date[_ + 'Date']();
        var D = date[_ + 'Day']();
        var m = date[_ + 'Month']();
        var y = date[_ + 'FullYear']();
        var H = date[_ + 'Hours']();
        var M = date[_ + 'Minutes']();
        var s = date[_ + 'Seconds']();
        var L = date[_ + 'Milliseconds']();
        var o = utc ? 0 : date.getTimezoneOffset();
        var W = getWeek(date);
        var N = getDayOfWeek(date);
        var flags = {
          d:    d,
          dd:   pad(d),
          ddd:  dateFormat.i18n.dayNames[D],
          dddd: dateFormat.i18n.dayNames[D + 7],
          m:    m + 1,
          mm:   pad(m + 1),
          mmm:  dateFormat.i18n.monthNames[m],
          mmmm: dateFormat.i18n.monthNames[m + 12],
          yy:   String(y).slice(2),
          yyyy: y,
          h:    H % 12 || 12,
          hh:   pad(H % 12 || 12),
          H:    H,
          HH:   pad(H),
          M:    M,
          MM:   pad(M),
          s:    s,
          ss:   pad(s),
          l:    pad(L, 3),
          L:    pad(Math.round(L / 10)),
          t:    H < 12 ? 'a'  : 'p',
          tt:   H < 12 ? 'am' : 'pm',
          T:    H < 12 ? 'A'  : 'P',
          TT:   H < 12 ? 'AM' : 'PM',
          Z:    gmt ? 'GMT' : utc ? 'UTC' : (String(date).match(timezone) || ['']).pop().replace(timezoneClip, ''),
          o:    (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
          S:    ['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10],
          W:    W,
          N:    N
        };
  
        return mask.replace(token, function (match) {
          if (match in flags) {
            return flags[match];
          }
          return match.slice(1, match.length - 1);
        });
      };
    })();

  dateFormat.masks = {
    'default':               'ddd mmm dd yyyy HH:MM:ss',
    'shortDate':             'm/d/yy',
    'mediumDate':            'mmm d, yyyy',
    'longDate':              'mmmm d, yyyy',
    'fullDate':              'dddd, mmmm d, yyyy',
    'shortTime':             'h:MM TT',
    'mediumTime':            'h:MM:ss TT',
    'longTime':              'h:MM:ss TT Z',
    'isoDate':               'yyyy-mm-dd',
    'isoTime':               'HH:MM:ss',
    'isoDateTime':           'yyyy-mm-dd\'T\'HH:MM:sso',
    'isoUtcDateTime':        'UTC:yyyy-mm-dd\'T\'HH:MM:ss\'Z\'',
    'expiresHeaderFormat':   'ddd, dd mmm yyyy HH:MM:ss Z'
  };

  // Internationalization strings
  dateFormat.i18n = {
    dayNames: [
      'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ],
    monthNames: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ]
  };

function pad(val, len) {
  val = String(val);
  len = len || 2;
  while (val.length < len) {
    val = '0' + val;
  }
  return val;
}

/**
 * Get the ISO 8601 week number
 * Based on comments from
 * http://techblog.procurios.nl/k/n618/news/view/33796/14863/Calculate-ISO-8601-week-and-year-in-javascript.html
 *
 * @param  {Object} `date`
 * @return {Number}
 */
function getWeek(date) {
  // Remove time components of date
  var targetThursday = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // Change date to Thursday same week
  targetThursday.setDate(targetThursday.getDate() - ((targetThursday.getDay() + 6) % 7) + 3);

  // Take January 4th as it is always in week 1 (see ISO 8601)
  var firstThursday = new Date(targetThursday.getFullYear(), 0, 4);

  // Change date to Thursday same week
  firstThursday.setDate(firstThursday.getDate() - ((firstThursday.getDay() + 6) % 7) + 3);

  // Check if daylight-saving-time-switch occured and correct for it
  var ds = targetThursday.getTimezoneOffset() - firstThursday.getTimezoneOffset();
  targetThursday.setHours(targetThursday.getHours() - ds);

  // Number of weeks between target Thursday and first Thursday
  var weekDiff = (targetThursday - firstThursday) / (86400000*7);
  return 1 + Math.floor(weekDiff);
}

/**
 * Get ISO-8601 numeric representation of the day of the week
 * 1 (for Monday) through 7 (for Sunday)
 * 
 * @param  {Object} `date`
 * @return {Number}
 */
function getDayOfWeek(date) {
  var dow = date.getDay();
  if(dow === 0) {
    dow = 7;
  }
  return dow;
}

/**
 * kind-of shortcut
 * @param  {*} val
 * @return {String}
 */
function kindOf(val) {
  if (val === null) {
    return 'null';
  }

  if (val === undefined) {
    return 'undefined';
  }

  if (typeof val !== 'object') {
    return typeof val;
  }

  if (Array.isArray(val)) {
    return 'array';
  }

  return {}.toString.call(val)
    .slice(8, -1).toLowerCase();
};



  if (typeof define === 'function' && define.amd) {
    define(function () {
      return dateFormat;
    });
  } else if (typeof exports === 'object') {
    module.exports = dateFormat;
  } else {
    global.dateFormat = dateFormat;
  }
})(this);

},{}],2:[function(require,module,exports){
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
        while(fullDays !== 0){
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
},{}],3:[function(require,module,exports){
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
},{"./calculateDueDate":2,"dateformat":1}]},{},[3]);
