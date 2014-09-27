//
// List of inline elements, br is left out deliberatly so it is treated as block
// level element. Spaces around br elements are redundant.
//
exports.inline = [
  'a', 'abbr', 'b', 'bdo', 'cite',
  'code', 'dfn', 'em', 'i', 'img', 'kbd',
  'q', 's', 'samp', 'small', 'span', 'strong',
  'sub', 'sup', 'textarea', 'var'
];

//
// List of singular elements, e.g. elements that have no closing tag.
//
exports.singular = [
  'area', 'base', 'br', 'col', 'command', 'embed', 'hr',
  'img', 'input', 'link', 'meta', 'param', 'source'
];

//
// List of redundant attributes, e.g. boolean attributes that require no value.
//
exports.redundant = [
  'autofocus', 'disabled', 'multiple', 'required', 'readonly', 'hidden',
  'async', 'defer', 'formnovalidate', 'checked', 'scoped', 'reversed',
  'selected', 'autoplay', 'controls', 'loop', 'muted', 'seamless',
  'default', 'ismap', 'novalidate', 'open', 'typemustmatch', 'truespeed',
  'itemscope'
];

//
// Elements that have special content, e.g. JS or CSS.
//
exports.node = [ 'tag', 'script', 'style' ];

//
// Elements that require and should keep structure to their content.
//
exports.structural = [ 'pre', 'textarea', 'code' ];