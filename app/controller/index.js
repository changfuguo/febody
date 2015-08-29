/*
* node site index controller
* author:changfuguo
* date  :2015-01-27
*
*/


var proxy = require('../proxy');

var Menu = proxy.Menu;
var Topic = proxy.Topic;
var Category = proxy.Category;
var q = require('q');
var config = require('../../config/config');

var log = require('log4js').getLogger('app');

//index method

exports.index = function(req, res, next){
	
	q.spread([Topic.query({status : 1}), Category.getList('article')],function(data,cates){
		var categoires = {};
		cates.forEach(function(v,i){
			categoires[v._id] = {
				id		:	v._id ,
				name	:	v.name ,
				value	:	v.value
			};
				
		})
		res.render('front/index',{articles :data, menus:res.locals.menus,categories : categoires});
	})
}

//get topic by categories
exports.getTopicsByCategory = function(req, res, next){

		res.send('aa')
}


//get topic by id 

exports.getTopicById = function(req, res, next){

	res.render('front/pages/topic');
}


