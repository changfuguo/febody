/*
 * admin controller 
 * author:jsjiker
 * date  :2015-06-01
 */

var User   = require('../proxy').User;
var validator      = require('validator');
var authMiddle  = require('../../middlewares/auth');
var config = require('../../config/config');
exports.index = function(req, res, next){
   
   res.render('index',{
        message :"hi yare here!"    
       
   });
}

/**
 *  进到这个页面其实也应该判定下是否已经登录了
 *  如果已经登录了则直接跳到首页，否则才是登录
 *
 **/
exports.showLogin = function(req, res, next){
 
	 req.session._loginReferer = req.headers.referer;
	 res.render('admin/pages/login');
}

/**
 * 登录的post请求，失败接着登录，否则跳转到管理首页
 *
 */
exports.login = function(req, res, next){
	
	var username = validator.trim(req.body.username).toLowerCase();
	var pass = validator.trim(req.body.password);

	var  sendError = function(code,msg){
		res.status(code);
		return res.render('admin/pages/login',{error:msg || '用户名或者密码不能为空'});
	
	}
	if(!username || !pass){
		sendError(402);
	}

	User.getUserByLoginName(username).then(function(user){
		console.log('yes user is here');	
		if(!user){
			return sendError(403);
		}
		try{

			var result  = User.comparePassword(username, pass ,user);
			if(result){
				authMiddle.get_session(user,res);
				var refer = req.session._loginReferer || "/";
				res.redirect('/admin/index');
			}else{
				sendError(200,"用户名和密码不匹配，重新输入");
			}
		}catch(e){
				res.status(500);
				res.render('500',{error:e});
		}
	},function(errormsg){
		
		return next(errormsg);
	})

}


/**
 * user logout 
 *
 *
 ***/

exports.logout = function(req, res, next){
	
	req.session.destroy();
	res.clearCookie(config.auth_cookie_name,{path:"/"});
	res.redirect('/');

}
