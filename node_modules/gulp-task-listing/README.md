# gulp-task-listing

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

Provides an easy way to get a listing of your tasks from your gulpfile.  By default, the output groups tasks based on whether or not they contain a hyphen (`-`), underscore (`_`), or colon (`:`) in their name.

You can optionally override the Regexp used to determine whether a task is a primary or subtask, as well as filter out tasks you don't want to see in the output.

## Usage

Install using:

    npm i --save-dev gulp-task-listing

Then add it to your gulpfile like so:

```js
var gulp = require('gulp');
var taskListing = require('gulp-task-listing');

// Add a task to render the output
gulp.task('help', taskListing);

// Add some top-level and sub tasks
gulp.task('build', ['build-js', 'build-css']);
gulp.task('build-js', function() { ... })
gulp.task('build-css', function() { ... })

gulp.task('compile', ['compile-js', 'compile-css']);
gulp.task('compile-js', function() { ... })
gulp.task('compile-css', function() { ... })
```

Now run `gulp help`, and you'll see this:

```plain
Main Tasks
------------------------------
    build
    compile
    help

Sub Tasks
------------------------------
    build-css
    build-js
    compile-css
    compile-js
```

## Customization

You can customize the output of the task listing by using the `taskListing.withFilters(subtaskFilter, excludeFilter)` method.  Both arguments are optional.  You can pass in a string, RegExp, or a custom function.

### subtaskFilter

Providing this allows you to choose which tasks are `Main Tasks` (by returning `false`), and which are `Sub Tasks` (by returning `true`).

By default, this is defined as the regular expression `/[-_:]/`, which means that any task with a hyphen, underscore, or colon in it's name is assumed to be a subtask.

If, for example, you wanted to *only* use colons to determine a task's status, you could set it up like so:

```js
gulp.task('help', taskListing.withFilters(/:/));
```

If you had something more complex, you can use a function, like so:

```js
gulp.task('help', taskListing.withFilters(function(task) {
	isSubTask = // test task name for sub task properties
	return isSubTask;
}));
```

### excludeFilter

The exclude filter allows you to remove tasks from the listing.  If you want to remove tasks that contain the word `secret`, you could set it up like so:

```js
gulp.task('help', taskListing.withFilters(null, 'secret'));
```

If you had something more complex, you can use a function, like so:

```js
gulp.task('help', taskListing.withFilters(null, function(task) {
	exclude = // test task name for exclusion
	return exclude;
}));
```

> Note: setting the first argument to `null` allows you to retain the default behavior for subtask detection.

## Help Support This Project

If you'd like to support this and other OverZealous Creations (Phil DeJarnett) projects, [donate via Gittip][gittip-url]!

[![Support via Gittip][gittip-image]][gittip-url]

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-task-listing
[npm-image]: https://badge.fury.io/js/gulp-task-listing.png

[travis-url]: http://travis-ci.org/OverZealous/gulp-task-listing
[travis-image]: https://secure.travis-ci.org/OverZealous/gulp-task-listing.png?branch=master

[gittip-url]: https://www.gittip.com/OverZealous/
[gittip-image]: https://raw2.github.com/OverZealous/gittip-badge/0.1.2/dist/gittip.png
