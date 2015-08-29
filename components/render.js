/*!
 *   from cnodejs.org
 *   render helper
 */

"use strict";

/**
 * Module dependencies.
 */

var MarkdownIt = require('markdown-it');
var _          = require('lodash');
var validator  = require('validator');
var multiline  = require('multiline');
var jsxss      = require('xss');
var config = require('../config/config');
var moment = require('moment');
// Set default options
var md = new MarkdownIt();

md.set({
  html:         true,        // Enable HTML tags in source
  xhtmlOut:     false,        // Use '/' to close single tags (<br />)
  breaks:       false,        // Convert '\n' in paragraphs into <br>
  linkify:      true,        // Autoconvert URL-like text to links
  typographer:  true,        // Enable smartypants and other sweet transforms
});

md.renderer.rules.fence = function (tokens, idx) {
  var token    = tokens[idx];
  var language = token.params && ('language-' + token.params) || '';
  language     = validator.escape(language);

  return '<pre class="prettyprint ' + language + '">'
    + '<code>' + validator.escape(token.content) + '</code>'
    + '</pre>';
};

md.renderer.rules.code_block = function (tokens, idx /*, options*/) {
  var token    = tokens[idx];
  var language = token.params && ('language-' + token.params) || '';
  language     = validator.escape(language);

  return '<pre class="prettyprint ' + language + '">'
    + '<code>' + validator.escape(token.content) + '</code>'
    + '</pre>';
};

md.renderer.rules.code_inline = function (tokens, idx /*, options*/) {
  return '<code>' + validator.escape(tokens[idx].content) + '</code>';
};

var myxss = new jsxss.FilterXSS({
  onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
    // 让 prettyprint 可以工作
    if (tag === 'pre' && name === 'class') {
      return name + '="' + jsxss.escapeAttrValue(value) + '"';
    }
  }
});

exports.markdown = function (text) {
  return '<div class="markdown-text">' + myxss.process(md.render(text || '')) + '</div>';
};

exports.multiline = multiline;

exports.escapeSignature = function (signature) {
  return signature.split('\n').map(function (p) {
    return _.escape(p);
  }).join('<br>');
};

exports.staticFile = function (filePath) {
  if (filePath.indexOf('http') === 0 || filePath.indexOf('//') === 0) {
    return filePath;
  }
  return config.host + filePath;
};
exports.moment = moment;
exports._ = _;
