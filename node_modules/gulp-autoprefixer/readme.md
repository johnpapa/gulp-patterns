# gulp-autoprefixer

[Autoprefixer](https://github.com/ai/autoprefixer) for
[gulp](https://github.com/wearefractal/gulp).

## Install

```sh
$ npm install gulp-autoprefixer
```

## Usage

```js
var gulp = require('gulp');
var prefix = require('gulp-autoprefixer');

gulp.task('default', function () {
  return gulp.src('src/styles/*.css')
    .pipe(prefix())
    .pipe(gulp.dest('dist/'));
});
```

### Examples

Specify the [browsers](https://github.com/postcss/autoprefixer#browsers) you
want to target:

```js
return gulp.src('src/styles/*.css')
  .pipe(prefix('last 2 versions', '> 1%', 'ie 9'))
  .pipe(gulp.dest('dist/'));
```

Disable the `cascade` option:

```js
return gulp.src('src/styles/*.css')
  .pipe(prefix('last 2 versions', '> 1%', 'ie 8', {cascade: false}))
  .pipe(gulp.dest('dist/'));
```

Enable `sourcemap` option:

```js
return gulp.src('src/styles/app.css')
  .pipe(prefix('last 2 versions', '> 1%', 'ie 9', { map: true, to: 'app.css' }))
  .pipe(gulp.dest('dist/'));
```

**Note:** The `sourcemap` option will not work with dynamic file names or multiple files. If you need that, please check [`gulp-foreach`](https://www.npmjs.org/package/gulp-foreach).

## License

Released under the MIT license.
