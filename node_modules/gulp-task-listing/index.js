/*jshint node:true */

"use strict";

var colors = require('chalk');
var gulp = require('gulp');


var DEFAULT_SUBTASK_REGEX = /[-_:]/,
	
	filter = function(inc, subtaskFilter) {
		return function(n) {
			var isSubtask = subtaskFilter(n);
			return (inc && isSubtask) || (!inc && !isSubtask);
		}
	},
	header = function(text) {
		console.log('');
		console.log(colors.gray(text));
		console.log('------------------------------');
	},
	regexFunc = function(rfn) {
		if(rfn && typeof rfn !== "function") {
			return function(t) {
				return t.search(rfn) !== -1; 
			};
		}
		return rfn;
	},
	
	help = function(subtaskFilter, excludeFilter) {
		subtaskFilter = regexFunc(subtaskFilter || DEFAULT_SUBTASK_REGEX);
		excludeFilter = regexFunc(excludeFilter);
		
		return function(cb) {
			var tasks = Object.keys(gulp.tasks).sort();
			if(excludeFilter) {
				tasks = tasks.filter(function(task) {
					return !excludeFilter(task);
				});
			}
		
			header('Main Tasks');
			
			tasks.filter(filter(false, subtaskFilter)).forEach(function(name) {
				console.log('    '+colors.cyan(name));
			});
		
			header('Sub Tasks');
			
			tasks.filter(filter(true, subtaskFilter)).forEach(function(name) {
				console.log('    '+name);
			});
		
			console.log('');
			
			// we're synchronous
			cb && cb();
		};
	};

module.exports = help();

module.exports.withFilters = function(subtaskFilter, excludeFilter) {
	return help(subtaskFilter, excludeFilter);
};

