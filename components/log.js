/**
* log for node
* author:changfuguo
* date  :2015-08-02
*/


var log4js = require('log4js');

var path  = require('path');
//configuration

log4js.configure({
    appenders:[
        {
          type:'console',
          category :'category'
        },{
            category:'console',
            type    :'file',
            filename:path.resolve(__dirname ,'../logs/','access.log'),
            maxLogSize :  1024 * 1024 ,
            backups : 1
        },{
            type : 'file',
            filename : path.resolve(__dirname ,'../logs/','febody.log'),
            maxLogSize : 1024 * 1024 ,
            backups : 10,
            category :'febody'
               
        },{
            type : 'dateFile',
            filename :path.resolve(__dirname ,'../logs/','febody.err.log'),
            alwaysIncludePattern: true,
            pattern:'_yyyy-MM-dd.log',
            category :'febody_err'
            
        } 
    ],
    replaceConsole:false,
    levels : {
        'access':'info',
		'febody':'info',
		'febody_arr':'warn'
    }
});


exports.use = function(app){

    var console = log4js.getLogger('console');
    app.use(log4js.connectLogger(console, {level : 'debug',format:':method :url'}));

}

var app = log4js.getLogger('febody');
var error = log4js.getLogger('febody_err');









