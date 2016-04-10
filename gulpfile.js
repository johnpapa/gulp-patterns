var gulp = require('gulp');

/**
 * yargs variables can be passed in to alter the behavior, when present.
 * Example: gulp serve-dev
 *
 * --verbose  : Various tasks will produce more output to the console.
 * --nosync   : Don't launch the browser with browser-sync when serving code.
 * --debug    : Launch debugger with node-inspector.
 * --debug-brk: Launch debugger and break on 1st line with node-inspector.
 * --startServers: Will start servers for midway tests on the test task.
 */

var di = require('gulp-di')(gulp, {
    pattern : ['gulp.*', 'gulp-*', 'browser-sync', '!gulp-di', 'wiredep', 'glob', 'del', 'lodash'],
    rename : {
        'lodash' : '_',
        'gulp-if' : '$if',
        'gulp-inject' : '$inject'
    }
});

// var colors = $.util.colors;
// var envenv = $.util.env;

di
.provide({
    args : require('yargs').argv,
    bowerConfiguration : require('./bower.json')
})
.tasks('./gulp/tasks')
.modules('./gulp/modules')
.resolve();

module.exports = gulp;
