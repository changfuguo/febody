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
    logger = require('morgan');


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

    //console.log(config);
	app.use(favicon(rootpath + 'public/favicon.ico')); 
	app.use(logger('dev'));
	
	app.use(express.static(rootpath + '/public'));
	app.set('views', rootpath + 'app/views');
	app.set('view engine','ejs');
	
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
		console.log(err.message);
		res.render('500', {
			message:err.message,
			error:err
		})
	})
	//console.log(config);
}
