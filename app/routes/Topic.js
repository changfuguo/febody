/*
* index routes 
* author:changfuguo
* date  :2015-01-27
*
*/
var cUser = require('../controller/User');
var cTopic = require('../controller/Topic');
var authMiddleware = require('../../middlewares/auth.js');
module.exports = function(app){

	app.get('/admin/test',cTopic.getList);
	//for front 
	app.get('/topic/:id', cTopic.index);
	//get topics by cate value
	app.get('/topics/cat/:name', cTopic.getTopicsByCategory);
}
