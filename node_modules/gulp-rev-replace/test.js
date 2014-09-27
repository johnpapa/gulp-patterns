'use strict';

/* global it */

var assert = require('assert');
var gutil = require('gulp-util');
var filter = require('gulp-filter');
var rev = require('gulp-rev');
var revReplace = require('./index');
var path = require('path');

var svgFileBody   = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg"></svg>';
var cssFileBody   = '@font-face { font-family: \'test\'; src: url(\'/fonts/font.svg\'); }\nbody { color: red; }';
var htmlFileBody  = '<html><head><link rel="stylesheet" href="/css/style.css" /></head><body><img src="images/image.png" /><img src="images/image.png" /></body></html>';

it('should by default replace filenames in .css and .html files', function (cb) {
  var filesToRevFilter = filter(['**/*.css', '**/*.svg', '**/*.png']);

  var stream = filesToRevFilter
    .pipe(rev())
    .pipe(filesToRevFilter.restore())
    .pipe(revReplace());

  var fileCount = 0;
  var unreplacedCSSFilePattern = /style\.css/;
  var unreplacedSVGFilePattern = /font\.svg/;
  var unreplacedPNGFilePattern = /image\.png/;
  stream.on('data', function(file) {
    var contents = file.contents.toString();
    var extension = path.extname(file.path);

    if (extension === '.html') {
      assert(
        !unreplacedCSSFilePattern.test(contents),
        'The renamed CSS file\'s name should be replaced'
      );
      assert(
        !unreplacedPNGFilePattern.test(contents),
        'The renamed PNG file\'s name should be globally replaced'
      );
    } else if (extension === '.css') {
      assert(
        !unreplacedSVGFilePattern.test(contents),
        'The renamed SVG file\'s name should be replaced'
      );
    } else if (extension === '.svg') {
      assert(
        contents === svgFileBody,
        'The SVG file should not be modified'
      );
    }

    fileCount++;
  });
  stream.on('end', function() {
    assert.equal(fileCount, 4, 'Only four files should pass through the stream');
    cb();
  });

  filesToRevFilter.write(new gutil.File({
    path: path.join('css', 'style.css'),
    contents: new Buffer(cssFileBody)
  }));
  filesToRevFilter.write(new gutil.File({
    path: path.join('fonts', 'font.svg'),
    contents: new Buffer(svgFileBody)
  }));
  filesToRevFilter.write(new gutil.File({
    path: 'images/image.png',
    contents: new Buffer('PNG')
  }));
  filesToRevFilter.write(new gutil.File({
    path: 'index.html',
    contents: new Buffer(htmlFileBody)
  }));

  filesToRevFilter.end();
});

it('should not replace filenames in extensions not in replaceInExtensions', function (cb) {
  var filesToRevFilter = filter(['**/*.css']);

  var stream = filesToRevFilter
    .pipe(rev())
    .pipe(filesToRevFilter.restore())
    .pipe(revReplace({replaceInExtensions: ['.svg']}));

  var unreplacedCSSFilePattern = /style\.css/;
  stream.on('data', function(file) {
    var contents = file.contents.toString();
    var extension = path.extname(file.path);

    if (extension === '.html') {
      assert(
        unreplacedCSSFilePattern.test(contents),
        'The renamed CSS file\'s name should not be replaced'
      );
    }
  });
  stream.on('end', function() {
    cb();
  });

  filesToRevFilter.write(new gutil.File({
    path: 'css\\style.css',
    contents: new Buffer(cssFileBody)
  }));
  filesToRevFilter.write(new gutil.File({
    path: 'index.html',
    contents: new Buffer(htmlFileBody)
  }));

  filesToRevFilter.end();
});

it('should not canonicalize URIs when option is off', function (cb) {
  var filesToRevFilter = filter(['**/*.css']);

  var stream = filesToRevFilter
    .pipe(rev())
    .pipe(filesToRevFilter.restore())
    .pipe(revReplace({canonicalUris: false}));

  var unreplacedCSSFilePattern = /style\.css/;
  stream.on('data', function(file) {
    var contents = file.contents.toString();
    var extension = path.extname(file.path);

    if (extension === '.html') {
      assert(
        unreplacedCSSFilePattern.test(contents),
        'The renamed CSS file\'s name should not be replaced'
      );
    }
  });
  stream.on('end', function() {
    cb();
  });

  filesToRevFilter.write(new gutil.File({
    path: 'css\\style.css',
    contents: new Buffer(cssFileBody)
  }));
  filesToRevFilter.write(new gutil.File({
    path: 'index.html',
    contents: new Buffer(htmlFileBody)
  }));

  filesToRevFilter.end();
});
