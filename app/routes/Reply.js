/*
* index routes 
* author:changfuguo
* date  :2015-01-27
*
*/
var cUser = require('../controller/User');
var cTopic = require('../controller/Topic');
var cReply = require('../controller/Reply');
var authMiddleware = require('../../middlewares/auth.js');
module.exports = function(app){

   
	//get topics by cate value
	app.post('/comment', cReply.addFromFront);
}
