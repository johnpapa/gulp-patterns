'use strict';

var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');

function relPath(base, filePath) {
  var newPath = filePath.replace(base, '');
  if (filePath !== newPath && newPath[0] === path.sep) {
    return newPath.substr(1);
  } else {
    return newPath;
  }
}

var plugin = function(options) {
  var renames = {};
  var cache = [];

  options = options || {};
  if (options.canonicalUris === undefined) {
    options.canonicalUris = true;
  }

  options.replaceInExtensions = options.replaceInExtensions || ['.js', '.css', '.html', '.hbs'];

  function fmtPath(base, filePath) {
    var newPath = relPath(base, filePath);
    if (path.sep !== '/' && options.canonicalUris) {
      newPath = newPath.split(path.sep).join('/');
    }
    return newPath;
  }

  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-rev-replace', 'Streaming not supported'));
      return cb();
    }

    // Collect renames from reved files.
    if (file.revOrigPath) {
      renames[fmtPath(file.revOrigBase, file.revOrigPath)] = fmtPath(file.base, file.path);
    }

    if (options.replaceInExtensions.indexOf(path.extname(file.path)) > -1) {
      // Cache file to perform replacements in it later.
      cache.push(file);
    } else {
      this.push(file);
    }

    cb();
  }, function(cb) {
    // Once we have a full list of renames, search/replace in the cached
    // files and push them through.
    var file;
    var contents;
    for (var i = 0, ii = cache.length; i !== ii; i++) {
      file = cache[i];
      contents = file.contents.toString();
      for (var rename in renames) {
        if (renames.hasOwnProperty(rename)) {
          contents = contents.split(rename).join(renames[rename]);
        }
      }
      file.contents = new Buffer(contents);
      this.push(file);
    }

    cb();
  });
};

module.exports = plugin;
