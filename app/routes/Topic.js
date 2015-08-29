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

   
	//get login page 
	app.get('/admin/topic/:id',cTopic.get); 
	
	app.delete('/admin/topic/:id',authMiddleware.userRequired,cTopic.delete );
	//post login info
	app.post('/admin/topic',authMiddleware.userRequired,cTopic.create);
		

	//logout 
	app.put('/admin/topic',authMiddleware.userRequired,cTopic.update);

	//get all categories 

	app.post('/admin/topics',authMiddleware.userRequired,cTopic.getList);
	
	app.get('/admin/test',cTopic.getList);


	//for front 
	app.get('/topic/:id', cTopic.index);
	//get topics by cate value
	app.get('/topics/cat/:name', cTopic.getTopicsByCategory);
}
