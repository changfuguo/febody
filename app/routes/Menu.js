/*
* index routes 
* author:changfuguo
* date  :2015-01-27
*
*/
var cMenu = require('../controller/Menu');
var authMiddleware = require('../../middlewares/auth.js');

module.exports = function(app){

   
	
	//post login info
	app.post('/admin/menu',authMiddleware.userRequired,cMenu.saveMenu);
		

	//get all categories 

	app.get('/admin/menu',authMiddleware.userRequired,cMenu.getMenu);
	//app.get('/admin/menu',authMiddleware.userRequired,cCategory.getList);

}
