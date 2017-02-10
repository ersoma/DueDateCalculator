# Due Date Calculator
The program reads the submit date and turnaround time as an input
and returns the date and time when the issue is to be resolved.
It is written in JavaScript and can be used as a node.js module or in the browser with a suitable builder tool.

To try it in the browser, [click here](https://ersoma.github.io/DueDateCalculator/).

## Specification
* Working hours are 9AM to 5PM every working day (Monday through Friday)
* A problem can only be reported during working hours, which means that all submit date values fall between 9AM and 5PM.
* The turnaround time is given in working hours, which means for example that 2 days are 16 hours. As an example: if a problem was reported at 2:12PM on Tuesday then it is due by 2:12PM on Thursday.

## Limitations
Currently the application has the following known limitations:
* The program does not deal with holidays, which means that a holiday on a Thursday is still considered as a working day by the program. Also a working Saturday will still be considered as a nonworking day by the system.
* The program only handles turnaround time in positive integer hours, more precise units are currently not supported.

## Scripts
To install all the dependencies run the following command:
```
npm install
```
Run all the tests with the following command:
```
npm run test
```
To browserify the module to work in the browser run:
```
npm run build
```
If you already have Browserify and Mocha installed as global packages you can also run the global instances and skip installing the developer dependencies:
```
npm run test_global
npm run build_global
```

## Technologies
The following technologies / modules were used during the development:

| Technology | Description |
| ---------------- | ---------------- |
| [Browserify](http://browserify.org/) | Browserify lets you require('modules') in the browser by bundling up all of your dependencies.  |
| [Bootstrap](http://getbootstrap.com/) | The most popular HTML, CSS, and JS framework for developing responsive, mobile first projects on the web. |
| [dateformat](https://www.npmjs.com/package/dateformat) | A node.js package for Steven Levithan's excellent dateFormat() function. |
| [chai](http://chaijs.com/) | Chai is a BDD / TDD assertion library that can be delightfully paired with any javascript testing framework. |
| [mocha](https://mochajs.org/) | Mocha is a feature-rich JavaScript test framework. |

## Why not TypeScript or ES6?
The size of the program and its limited complexity does not justify the use of these additional technologies and
the extra complexity they come with just makes the development more complex so I decided not to use them.

## Why not moment.js?
[Moment.js](https://momentjs.com/) is a widely used library to parse, validate, manipulate, and display dates in JavaScript.
It extends the otherwise limited capabilities of the built in Date object. However in this case I decided not to use it,
so I can practice the default functions. In any more complicated application I would use the useful library.

## Possible improvements
* In other cultures working hours can be different than what the program uses and weekend can also be shorter. So it would be nice to include these as optional inputs for the function.
* Currently the program does not deal with holidays and working weekends which also can be improved. It could take an optional input array with dates that are different than normal use cases.
* It might be useful in some cases if the program could handle time more precisely than minutes.
