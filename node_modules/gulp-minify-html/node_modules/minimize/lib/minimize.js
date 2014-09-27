'use strict';

//
// Required modules.
//
var html = require('htmlparser2')
  , EventEmitter = require('events').EventEmitter
  , Helpers = require('./helpers');

/**
 * Minimizer constructor.
 *
 * @Constructor
 * @param {Object} options parsing options, optional
 * @api public
 */
function Minimize(options) {
  //
  // Pass options to helpers.
  //
  this.helpers = new Helpers(options || {});

  //
  // Prepare the parser.
  //
  this.htmlparser = new html.Parser(
    new html.DomHandler(this.minifier.bind(this))
  );
}

//
// Add EventEmitter prototype.
//
Minimize.prototype.__proto__ = EventEmitter.prototype;

/**
 * Start parsing the provided content and call the callback.
 *
 * @param {String} content HTML
 * @param {Function} callback
 * @api public
 */
Minimize.prototype.parse = function parse(content, callback) {
  if (typeof callback !== 'function') throw new Error('No callback provided');

  //
  // Listen to DOM parsing, so the htmlparser callback can trigger it.
  //
  this.once('parsed', callback);

  //
  // Initiate parsing of HTML.
  //
  this.htmlparser.parseComplete(content);
};

/**
 * Parse traversable DOM to content.
 *
 * @param {Object} error
 * @param {Object} dom presented as traversable object
 * @api private
 */
Minimize.prototype.minifier = function minifier(error, dom) {
  if (error) throw new Error('Minifier failed to parse DOM', error);

  //
  // DOM has been completely parsed, emit the results.
  //
  this.emit('parsed', error, this.traverse(dom, ''));
};

/**
 * Traverse the data object, reduce data to string.
 *
 * @param {Array} data
 * @param {String} html compiled contents.
 * @return {String} completed HTML
 * @api private
 */
Minimize.prototype.traverse = function traverse(data, html) {
  return data.reduce(this.walk.bind(this), html);
};

/**
 * Walk the provided DOM, reduce helper.
 *
 * @param {String} data compiled contents.
 * @param {Object} element
 * @return {String}
 * @api private
 */
Minimize.prototype.walk = function walk(html, element) {
  html += this.helpers[element.type](element, html);

  return (element.children
    ? this.traverse(element.children, html)
    : html) + this.helpers.close(element);
};

//
// Expose the minimize function by default.
//
module.exports = Minimize;
