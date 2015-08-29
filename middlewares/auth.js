/**
 * auth middleware
 *
 **/

var mongoose   = require('mongoose');
var UserModel  = mongoose.model('User');
var UserProxy  = require('../app/proxy').User;
var config     = require('../config/config');


exports.userRequired = function(req, res, next){
 
	if(!req.session || !req.session.user){
		return res.redirect('/admin/login?error=请登陆后再说哥们');
	}else{
		next();	
	}
}

function gen_session(user,res){

	var auth_token = user._id + '$$$$';
	var opts = {
		path : '/',
		maxAge : 1000 * 60 * 60 * 24 * 7 ,
		signed: true ,
		httpOnly: true 
	};
	 res.cookie(config.auth_cookie_name, auth_token, opts); //cookie 有效期30天
}
exports.get_session = gen_session;

/**
 * check if the user is logined
 **/

//auth_cookie_name

exports.authUser = function(req, res ,next){

	res.locals.current_user = null ;

	if(req.session.user){
		res.locals.current_user = req.session.user = new UserModel(req.session.user);
		next();
	}else{
		var auth_token = req.signedCookies[config.auth_cookie_name];
		if(!auth_token){
			return next();
		}

		var userid = auth_token.split('$$$$')[0];
		
		UserProxy.getUserById(userid)
			.then(	function(user){
						res.locals.current_user = req.session.user = new UserModel(user);
						next();
					},function(){
						next();
					}
			)
	}	
}
