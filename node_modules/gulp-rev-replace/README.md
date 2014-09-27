[gulp](https://github.com/wearefractal/gulp)-rev-replace [![Build Status](https://travis-ci.org/jamesknelson/gulp-rev-replace.svg?branch=master)](https://travis-ci.org/jamesknelson/gulp-rev-replace)
================

Rewrite occurences of filenames which have been renamed by gulp-rev

## Install

```bash
$ npm install --save-dev gulp-rev-replace
```


## Usage

Pipe through a stream which has both the files you want to be updated, as well as the files which have been renamed.

For example, we can use [gulp-useref](https://github.com/jonkemp/gulp-useref) to concatenate assets in an index.html,
and then use [gulp-rev](https://github.com/sindresorhus/gulp-rev) and gulp-rev-replace to cache-bust them.

```js
var gulp = require('gulp');
var rev = require('gulp-rev');
var useref = require('gulp-useref');
var filter = require('gulp-filter');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');

gulp.task("index", function() {
  var jsFilter = filter("**/*.js");
  var cssFilter = filter("**/*.css");

  return gulp.src("src/index.html")
    .pipe(useref.assets())      // Concatenate with gulp-useref
    .pipe(jsFilter)
    .pipe(uglify())             // Minify any javascript sources
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe(csso())               // Minify any CSS sources
    .pipe(cssFilter.restore())
    .pipe(rev())                // Rename the concatenated files
    .pipe(useref.restore())
    .pipe(useref())
    .pipe(revReplace())         // Substitute in new filenames
    .pipe(gulp.dest('public'));
});
```

## API

### revReplace(options)

#### options.canonicalUris
Type: `boolean`

Default: `true`

Use canonical Uris when replacing filePaths, i.e. when working with filepaths
with non forward slash (`/`) path separators we replace them with forward slash.

#### options.replaceInExtensions
Type: 'array'

Default: ['.js', '.css', '.html', '.hbs']

Only substitute in new filenames in files of these types

## Contributors

Chad Jablonski
Denis Parchenko
Håkon K. Eide
Juan Lasheras
Simon Ihmig


## License

[MIT](http://opensource.org/licenses/MIT) © [James K Nelson](http://jamesknelson.com)