/*
 * 模板帮助类，主要实现前端html从ejs查询
 * author:changfuguo
 * date:2015-06-04
 */

var config = require('../config/config'),
	fs = require('fs'),
	q = require('q'),
	path = require('path');

var rootpath = config.rootpath;
var tpl = 'ejs';

exports.existsTemplate = function(mod, pt){
	var defer = q.defer(), promise = defer.promise;

	var filepath = path.join(rootpath,'app/views', mod, pt + '.' + tpl);
	fs.exists(filepath, function(exist){
		defer.resolve(exist)	
	})

	return promise ;
}



