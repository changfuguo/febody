/*
* index routes 
* author:changfuguo
* date  :2015-01-27
*
*/
var cUser = require('../controller/User');
var cCategory = require('../controller/Category');
var cTopic = require('../controller/Topic');
var authMiddleware = require('../../middlewares/auth.js');
module.exports = function(app){

   
	//get login page 
	app.get('/admin/category/:id',authMiddleware.userRequired, function(req, res, next){
		console.log(req.params)
		res.send('test' + req.params.id);		
	});
	
	app.delete('/admin/category/:id',authMiddleware.userRequired,cCategory.delete );
	//post login info
	app.post('/admin/category',authMiddleware.userRequired,cCategory.create);
		

	//logout 
	app.put('/admin/category',authMiddleware.userRequired,cCategory.update);

	//get all categories 

	app.get('/admin/categories',authMiddleware.userRequired,cCategory.getList);
}
