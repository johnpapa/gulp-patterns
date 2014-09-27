# [gulp](https://github.com/wearefractal/gulp)-bytediff [![Build Status](https://travis-ci.org/ben-eb/gulp-bytediff.svg?branch=master)](https://travis-ci.org/ben-eb/gulp-bytediff) [![NPM version](https://badge.fury.io/js/gulp-bytediff.png)](http://badge.fury.io/js/gulp-bytediff) [![Dependency Status](https://gemnasium.com/ben-eb/gulp-bytediff.png)](https://gemnasium.com/ben-eb/gulp-bytediff)

> Compare file sizes before and after your gulp build process.

Install via [npm](https://npmjs.org/package/gulp-bytediff):

```
npm install gulp-bytediff --save-dev
```

## Example

Take any gulpplugin, or series of gulpplugins and see how much the build process added to, or removed from, your filesize. This example uses another of my modules, [gulp-csso](https://npmjs.org/package/gulp-csso).

```js
var gulp = require('gulp');
var bytediff = require('gulp-bytediff');
var csso = require('gulp-csso');

gulp.task('default', function() {
    gulp.src('main.css')
        .pipe(bytediff.start())
        .pipe(csso())
        .pipe(bytediff.stop())
        .pipe(gulp.dest('./out'));
});
```

## API

### bytediff.start() or bytediff()

Creates a new property on the file object that saves its current size.

### bytediff.stop(formatFunction)

Outputs the difference between the property saved with the `start()` method and the current filesize.

Customise the output of this by using the format function. An example:

```js
    // ...
    .pipe(bytediff.stop(function(data) {
        var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
        return data.fileName + ' is ' + data.percent + '%' + difference;
    }))
    .pipe(gulp.dest('./out'));
```

The function gets passed an object with the following properties:

* fileName
* startSize
* endSize
* savings
* percent
