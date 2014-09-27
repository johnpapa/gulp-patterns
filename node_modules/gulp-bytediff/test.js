/* jshint node: true */
/* global describe, it */

'use strict';

var bytediff = require('./index'),
    expect   = require('chai').expect,
    gulp     = require('gulp'),
    map      = require('map-stream');

describe('gulp-bytediff', function() {
    it('should store the original size on the file object', function(cb) {
        gulp.src('./index.js')
            .pipe(bytediff())
            .pipe(map(function(file) {
                expect(file.bytediff.startSize).to.be.a('number');
                cb();
            }));
    });
    it('should be able to report the new size of a file', function(cb) {
        var output = '';
        process.stdout.write = (function(write) {
            return function(string) {
                output = string;
                write.apply(process.stdout, arguments);
            };
        })(process.stdout.write);
        gulp.src('./index.js')
            .pipe(bytediff())
            .pipe(map(function(file, done) {
                file.contents = new Buffer('minification happened');
                done(null, file);
            }))
            .pipe(bytediff.stop())
            .pipe(map(function() {
                expect(output).to.have.string('21 B');
                cb();
            }));
    });
});
