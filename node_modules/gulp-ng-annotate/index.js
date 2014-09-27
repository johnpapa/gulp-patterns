"use strict";

var gutil = require("gulp-util");
var through = require("through2");
var ngAnnotate = require("ng-annotate");
var applySourceMap = require("vinyl-sourcemaps-apply");
var merge = require("merge");

module.exports = function (options) {
  options = options || {add: true};

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit("error", new gutil.PluginError("gulp-ng-annotate", "Streaming not supported"));
      return cb();
    }

    var opts = merge({sourcemap: !!file.sourceMap}, options);
    if (file.path) {
      opts.inFile = file.relative;
    }

    var res = ngAnnotate(file.contents.toString(), opts);
    if (res.errors) {
      var filename = "";
      if (file.path) {
        filename = file.relative + ": ";
      }
      this.emit("error", new gutil.PluginError("gulp-ng-annotate", filename + res.errors.join("\n")));
      return cb();
    }
    file.contents = new Buffer(res.src);

    if (opts.sourcemap && file.sourceMap) {
      var sourceMap = JSON.parse(res.map);
      sourceMap.file = file.relative.replace(/\\/g, '');
      applySourceMap(file, sourceMap);
    }

    this.push(file);
    cb();
  });
};
