'use strict';

var fs = require('fs'),
    _ = require('lodash-node'),
    map = require('map-stream'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError,
    Cache = require('cache-swap'),
    TaskProxy = require('./lib/TaskProxy'),
    pkgInfo = require('./package.json');

var fileCache = new Cache({
    cacheDirName: 'gulp-cache'
});

var defaultOptions = {
    fileCache: fileCache,
    name: 'default',
    key: function (file) {
        if (file.isBuffer()) {
            return [pkgInfo.version, file.contents.toString('base64')].join('');
        }

        return undefined;
    },
    restore: function (restored) {
        if (restored.contents) {
            // Handle node 0.11 buffer to JSON as object with { type: 'buffer', data: [...] }
            if (_.isObject(restored.contents) && _.isArray(restored.contents.data)) {
                restored.contents = new Buffer(restored.contents.data);
            } else if (_.isArray(restored.contents)) {
                restored.contents = new Buffer(restored.contents);
            } else if (_.isString(restored.contents)) {
                restored.contents = new Buffer(restored.contents, 'base64');
            }
        }

        var restoredFile = new gutil.File(restored),
            extraTaskProperties = _.omit(restored, _.keys(restoredFile));

        // Restore any properties that the original task put on the file;
        // but omit the normal properties of the file
        _.merge(restoredFile, extraTaskProperties);

        return restoredFile;
    },
    success: true,
    value: function (file) {
        // Convert from a File object (from vinyl) into a plain object
        return _.pick(file, 'cwd', 'base', 'path', 'contents', 'stat');
    }
};

var cacheTask = function (task, opts) {
    // Check for required task option
    if (!task) {
        throw new PluginError('gulp-cache', 'Must pass a task to cache()');
    }

    // Check if this task participates in the cacheable contract
    if (task.cacheable) {
        // Use the cacheable options, but allow the user to override them
        opts = _.extend({}, task.cacheable, opts);
    }

    // Make sure we have some sane defaults
    opts = _.defaults(opts || {}, cacheTask.defaultOptions);

    return map(function (file, cb) {
        // Indicate clearly that we do not support Streams
        if (file.isStream()) {
            cb(new PluginError('gulp-cache', 'Can not operate on stream sources'));
            return;
        }

        // Create a TaskProxy object and start up processFile().

        var taskProxy = new TaskProxy({
            task: task,
            file: file,
            opts: opts
        });

        taskProxy.processFile().then(function (result) {
            cb(null, result);
        }).catch(function (err) {
            cb(new PluginError('gulp-cache', err));
        });
    });
};

cacheTask.clear = function (opts) {
    opts = _.defaults(opts || {}, cacheTask.defaultOptions);

    return map(function (file, cb) {
        // Indicate clearly that we do not support Streams
        if (file.isStream()) {
            cb(new PluginError('gulp-cache', 'Can not operate on stream sources'));
            return;
        }

        var taskProxy = new TaskProxy({
            task: null,
            file: file,
            opts: opts
        });

        taskProxy.removeCachedResult().then(function () {
            cb(null, file);
        }).catch(function (err) {
            cb(new PluginError('gulp-cache', err));
        });
    });
};

cacheTask.clearAll = function (done) {
    done = done || _.noop;

    fileCache.clear(null, function (err) {
        if (err) {
            throw new PluginError('gulp-cache', 'Problem clearing the cache: ' + err.message);
        }

        done();
    });
};

cacheTask.fileCache = fileCache;
cacheTask.defaultOptions = defaultOptions;

module.exports = cacheTask;
