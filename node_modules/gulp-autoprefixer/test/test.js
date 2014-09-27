'use strict';

var prefix = require('../');
var should = require('should');
var fs = require('fs');
var autoprefixer = require('autoprefixer');
var gutil = require('gulp-util');
var Stream = require('stream');
var es = require('event-stream');
require('mocha');

var testBrowsers = ['last 1 version', '> 1%', 'ie 8', 'ie 7'];
var testOptions = {
  cascade: false
};

var testfile = fs.readFileSync('./test/test.css', 'utf8');

describe('gulp-autoprefixer', function () {

  it('should prefix with defaults', function (done) {
    var stream = prefix();
    var fakeFile = new gutil.File({
      contents: new Buffer(testfile)
    });

    stream.on('data', function (newFile) {
      String(newFile.contents).should.equal(autoprefixer.process(testfile).css);
      done();
    });

    stream.write(fakeFile);
    stream.end();
  });

  it('should prefix with browsers', function (done) {
    var stream = prefix('last 1 version', '> 1%', 'ie 8', 'ie 7');
    var fakeFile = new gutil.File({
      contents: new Buffer(testfile)
    });

    stream.on('data', function (newFile) {
      String(newFile.contents).should.equal(autoprefixer('last 1 version', '> 1%', 'ie 8', 'ie 7').process(testfile).css);
      done();
    });

    stream.write(fakeFile);
    stream.end();
  });

  it('should prefix with browsers array', function (done) {
    var stream = prefix(testBrowsers);
    var fakeFile = new gutil.File({
      contents: new Buffer(testfile)
    });

    stream.on('data', function (newFile) {
      String(newFile.contents).should.equal(autoprefixer(testBrowsers).process(testfile).css);
      done();
    });

    stream.write(fakeFile);
    stream.end();
  });

  it('should prefix with options', function (done) {
    var stream = prefix(testOptions);
    var fakeFile = new gutil.File({
      contents: new Buffer(testfile)
    });

    stream.on('data', function (newFile) {
      String(newFile.contents).should.equal(autoprefixer(testOptions).process(testfile).css);
      done();
    });

    stream.write(fakeFile);
    stream.end();
  });

  it('should prefix with cascade: false', function (done) {
    var stream = prefix({cascade: false});
    var fakeFile = new gutil.File({
      contents: new Buffer(testfile)
    });

    stream.on('data', function (newFile) {
      String(newFile.contents).should.equal(autoprefixer({cascade: false}).process(testfile).css);
      done();
    });

    stream.write(fakeFile);
    stream.end();
  });

  it('should prefix with cascade: true', function (done) {
    var stream = prefix({cascade: true});
    var fakeFile = new gutil.File({
      contents: new Buffer(testfile)
    });

    stream.on('data', function (newFile) {
      String(newFile.contents).should.equal(autoprefixer({cascade: true}).process(testfile).css);
      done();
    });

    stream.write(fakeFile);
    stream.end();
  });

  it('should prefix with browsers and options', function (done) {
    var stream = prefix('last 1 version', '> 1%', 'ie 8', 'ie 7', testOptions);
    var fakeFile = new gutil.File({
      contents: new Buffer(testfile)
    });

    stream.on('data', function (newFile) {
      String(newFile.contents).should.equal(autoprefixer('last 1 version', '> 1%', 'ie 8', 'ie 7', testOptions).process(testfile).css);
      done();
    });

    stream.write(fakeFile);
    stream.end();
  });

  it('should prefix with browsers array and options', function (done) {
    var stream = prefix(testBrowsers, testOptions);
    var fakeFile = new gutil.File({
      contents: new Buffer(testfile)
    });

    stream.on('data', function (newFile) {
      String(newFile.contents).should.equal(autoprefixer(testBrowsers, testOptions).process(testfile).css);
      done();
    });

    stream.write(fakeFile);
    stream.end();
  });

  it('should prefix with sourcemaps', function (done) {
    var localTestOptions = { map: true, to: 'test.css' };
    var stream = prefix(testBrowsers, localTestOptions);
    var fakeFile = new gutil.File({
      contents: new Buffer(testfile)
    });

    stream.on('data', function (newFile) {
      String(newFile.contents).should.equal(autoprefixer(testBrowsers, localTestOptions).process(testfile, localTestOptions).css);
      done();
    });

    stream.write(fakeFile);
    stream.end();
  });

  it('should prefix with cascade and sourcemaps', function (done) {
    var localTestOptions = { casecade: true, map: true, to: 'test.css' };
    var stream = prefix(testBrowsers, localTestOptions);
    var fakeFile = new gutil.File({
      contents: new Buffer(testfile)
    });

    stream.on('data', function (newFile) {
      String(newFile.contents).should.equal(autoprefixer(testBrowsers, localTestOptions).process(testfile, localTestOptions).css);
      done();
    });

    stream.write(fakeFile);
    stream.end();
  });

  it('should work the same in stream mode', function (done) {
    var stream = prefix();
    var fakeFile = new gutil.File({
      contents: new Stream()
    });

    stream.on('data', function (data) {
      data.contents.pipe(es.wait(function (err, data) {
        String(data).should.equal(autoprefixer.process(testfile).css);
        done();
      }));
    });

    stream.write(fakeFile);
    fakeFile.contents.write(testfile);
    fakeFile.contents.end();
  });

  it('should work the same in stream mode, with browsers', function (done) {
    var stream = prefix('last 1 version', '> 1%', 'ie 8', 'ie 7');
    var fakeFile = new gutil.File({
      contents: new Stream()
    });

    stream.on('data', function (data) {
      data.contents.pipe(es.wait(function (err, data) {
        String(data).should.equal(autoprefixer('last 1 version', '> 1%', 'ie 8', 'ie 7').process(testfile).css);
        done();
      }));
    });

    stream.write(fakeFile);
    fakeFile.contents.write(testfile);
    fakeFile.contents.end();
  });

  it('should work the same in stream mode, with browsers array', function (done) {
    var stream = prefix(testBrowsers);
    var fakeFile = new gutil.File({
      contents: new Stream()
    });

    stream.on('data', function (data) {
      data.contents.pipe(es.wait(function (err, data) {
        String(data).should.equal(autoprefixer(testBrowsers).process(testfile).css);
        done();
      }));
    });

    stream.write(fakeFile);
    fakeFile.contents.write(testfile);
    fakeFile.contents.end();
  });

  it('should work the same in stream mode, with options', function (done) {
    var stream = prefix(testOptions);
    var fakeFile = new gutil.File({
      contents: new Stream()
    });

    stream.on('data', function (data) {
      data.contents.pipe(es.wait(function (err, data) {
        String(data).should.equal(autoprefixer(testOptions).process(testfile).css);
        done();
      }));
    });

    stream.write(fakeFile);
    fakeFile.contents.write(testfile);
    fakeFile.contents.end();
  });

  it('should work the same in stream mode, with cascade: false', function (done) {
    var stream = prefix({cascade: false});
    var fakeFile = new gutil.File({
      contents: new Stream()
    });

    stream.on('data', function (data) {
      data.contents.pipe(es.wait(function (err, data) {
        String(data).should.equal(autoprefixer({cascade: false}).process(testfile).css);
        done();
      }));
    });

    stream.write(fakeFile);
    fakeFile.contents.write(testfile);
    fakeFile.contents.end();
  });

  it('should work the same in stream mode, with cascade: true', function (done) {
    var stream = prefix({cascade: true});
    var fakeFile = new gutil.File({
      contents: new Stream()
    });

    stream.on('data', function (data) {
      data.contents.pipe(es.wait(function (err, data) {
        String(data).should.equal(autoprefixer({cascade: true}).process(testfile).css);
        done();
      }));
    });

    stream.write(fakeFile);
    fakeFile.contents.write(testfile);
    fakeFile.contents.end();
  });

  it('should work the same in stream mode, with browsers and options', function (done) {
    var stream = prefix('last 1 version', '> 1%', 'ie 8', 'ie 7', testOptions);
    var fakeFile = new gutil.File({
      contents: new Stream()
    });

    stream.on('data', function (data) {
      data.contents.pipe(es.wait(function (err, data) {
        String(data).should.equal(autoprefixer('last 1 version', '> 1%', 'ie 8', 'ie 7', testOptions).process(testfile).css);
        done();
      }));
    });

    stream.write(fakeFile);
    fakeFile.contents.write(testfile);
    fakeFile.contents.end();
  });

  it('should work the same in stream mode, with browsers array and options', function (done) {
    var stream = prefix(testBrowsers, testOptions);
    var fakeFile = new gutil.File({
      contents: new Stream()
    });

    stream.on('data', function (data) {
      data.contents.pipe(es.wait(function (err, data) {
        String(data).should.equal(autoprefixer(testBrowsers, testOptions).process(testfile).css);
        done();
      }));
    });

    stream.write(fakeFile);
    fakeFile.contents.write(testfile);
    fakeFile.contents.end();
  });

  it('should let null files pass through', function (done) {
    var stream = prefix(),
      n = 0;
    stream.pipe(es.through(function (file) {
      file.path.should.equal('null.md');
      (file.contents === null).should.be.true;
      n++;
    }, function () {
      n.should.equal(1);
      done();
    }));
    stream.write(new gutil.File({
      path: 'null.md',
      contents: null
    }));
    stream.end();
  });

  it('should work the same in stream mode, with sourcemaps', function (done) {
    var localTestOptions = { map: true, to: 'test.css' };
    var stream = prefix(testBrowsers, localTestOptions);
    var fakeFile = new gutil.File({
      contents: new Stream()
    });

    stream.on('data', function (data) {
      data.contents.pipe(es.wait(function (err, data) {
        String(data).should.equal(autoprefixer(testBrowsers, localTestOptions).process(testfile, localTestOptions).css);
        done();
      }));
    });

    stream.write(fakeFile);
    fakeFile.contents.write(testfile);
    fakeFile.contents.end();
  });

  it('should work the same in stream mode, with cascade and sourcemaps', function (done) {
    var localTestOptions = { cascade: true, map: true, to: 'test.css' };
    var stream = prefix(testBrowsers, localTestOptions);
    var fakeFile = new gutil.File({
      contents: new Stream()
    });

    stream.on('data', function (data) {
      data.contents.pipe(es.wait(function (err, data) {
        String(data).should.equal(autoprefixer(testBrowsers, localTestOptions).process(testfile, localTestOptions).css);
        done();
      }));
    });

    stream.write(fakeFile);
    fakeFile.contents.write(testfile);
    fakeFile.contents.end();
  });

});
