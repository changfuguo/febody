/*
* index routes 
* author:changfuguo
* date  :2015-01-27
*
*/
var cUser = require('../controller/User');
var cReply = require('../controller/Reply');
var cTopic = require('../controller/Topic');
var tplHelper = require('../../components/template');
var authMiddleware = require('../../middlewares/auth.js');
module.exports = function(app){

    //app.get 
   
	app.get('/admin',function(req,res,next){
		next();		
	})
    app.get('/admin/index', authMiddleware.userRequired, function(req, res, next){
        res.render('admin/index',{}) ;       
    })
	//get static template for angularjs
	app.get(/^\/admin\/gettemplate!([a-z0-9-\/_]+)\.html/,function(req,res,next){
		var path = req.params['0'] || '';
		tplHelper.existsTemplate('admin',path)
			.then(function(exist){
				if(exist){
					res.render('admin/' + path);
				}else{
					return res.status(404).send('模板不存在');
				}	
			})
	})

	//get login page 
	app.get('/admin/login',cUser.showLogin);
		
	//post login info
	app.post('/admin/login',cUser.login);

	//logout 

	app.get('/admin/logout',cUser.logout);

	// comment
	app.post('/admin/comment/del',authMiddleware.userRequired,cReply.delete);
	app.post('/admin/comment/publish',authMiddleware.userRequired,cReply.publish);
	app.post('/admin/topic/:id/comments',authMiddleware.userRequired,cReply.getList);
	
	//get login page 
	app.get('/admin/topic/:id',cTopic.get); 
	
	app.post('/admin/topic/del',authMiddleware.userRequired,cTopic.delete);
	app.post('/admin/topic/publish',authMiddleware.userRequired,cTopic.publish);
	//post login info
	app.post('/admin/topic',authMiddleware.userRequired,cTopic.create);
	//logout 
	app.put('/admin/topic',authMiddleware.userRequired,cTopic.update);
	//get all categories 
	app.post('/admin/topics',authMiddleware.userRequired,cTopic.getList);
}
