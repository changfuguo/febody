/**
* express config  for app
* @author:changfuguo
* @date:2015-02-06
*/
var express =  require('express') ,
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session) ,
	favicon = require('serve-favicon'),
	flash  = require('connect-flash'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	compression = require('compression'),
    methodOverride = require('method-override'),
    logger = require('morgan'),
    ejsmate = require('ejs-mate'),
	compression = require('compression'),
	csurf = require('csurf'),
	_  = require('lodash'),
	render = require('../components/render'),
	log4js =  require('log4js');

var authMiddle = require('../middlewares/auth');

var Menu = require('../app/proxy').Menu;
var log = log4js.getLogger('app');
log.error('aaaa')
module.exports =  function(app){

    
    var config = require('./config');
    var rootpath = config.rootpath;
    //console.log('app test for self ');
    
	app.set('showStackError', true);
	app.use(compression({
		filter: function (req, res) {
		    return /json|text|javascript|css/.test(res.getHeader('Content-Type'))
		   }
	}))

	app.use(favicon(rootpath + 'public/favicon.ico')); 
	//app.use(logger('dev'));
	app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));	
	app.use(express.static(rootpath + '/public'));
	app.set('views', rootpath + 'app/views');
	app.set('view engine','ejs');
	//app.engine('ejs',ejsmate);
	//set session
		
	//use cookie
	app.use(cookieParser(config.session_secret));
	app.use(bodyParser.urlencoded({extended:false}));
	app.use(bodyParser.json());
	app.use(methodOverride()); 
	//set session 
	app.use(session({
		secret :config.session_secret ,
		store: new MongoStore({
			url : config.db ,
			collection :'sessions',
			autoReconnect:true,
            ttl :config.session_timeout
		}) ,
        resave: true,
        saveUninitialized: true
	}))
	
	app.use(flash());

	//校验是否登录了
	app.use(authMiddle.authUser);

	//render to ejs
	_.extend(app.locals, render);
	//生成csurl校验
	app.use(function(req, res, next){
		csurf()(req,res, next);
		return ;
			
	})

	//本地变量
	var assets = {};
	_.extend(app.locals,{
		config: config,
		assets:assets
	})
	app.use(function (req, res, next) {
		res.locals.csrf = req.csrfToken ? req.csrfToken():'';
		next();
	})

	//cache menus 

	//set local menus 

	app.use(function(req, res, next){
		if (!app.locals.menus ||  ( +new Date() - app.locals.lastWriteMenu  > 24 * 3600 * 1000) ){
			Menu.getMenu()
			.then(function(data){
				app.locals.menus = data || [];
				app.locals.lastWriteMenu = +new Date();
				res.locals.menus = data || [];
				res.locals.menus.unshift({
					"text": "首页",
					"a_attr" :{
						"href":"/",
						"target":"_self"
					} 
				})
				next();
			})
		}else{
			res.locals.menus =  app.locals.menus;
			next();
		}
	})
	//set 404 
	app.use(function(err,req , res , next){
		res.status(404).render('404',{
			url : req.riginalUrl,
			error:'Page is roading to Moon ,we can not found!Message:'+err.message
		})
	})
	
	//set 500
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('500', {
			message:err.message,
			error:err
		})
	})
	//console.log(config);
}
