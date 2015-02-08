/**
* log for node
* author:changfuguo
* date  :2014-01-18
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
            filename:path.resolve(__dirname ,'../logs/','console.log'),
            maxLogSize :  1024 * 1024 ,
            backups : 1
        },{
            type : 'file',
            filename : path.resolve(__dirname ,'../logs/','trace.log'),
            maxLogSize : 1024 * 1024 ,
            backups : 10,
            category :'trace'
               
        },{
            type : 'dateFile',
            filename :path.resolve(__dirname ,'../logs/','error.log'),
            alwaysIncludePattern: true,
            pattern:'_yyyy-MM-dd.log',
            category :'error'
            
        } 
    ],
    replaceConsole:false,
    levels : {
        'console':'info'
    }
});


exports.use = function(app){

    var console = log4js.getLogger('console');
    app.use(log4js.connectLogger(console, {level : 'debug',format:':method :url'}));

}


exports.log = function(name){

    var logger = log4js.getLogger(name);
    logger.setLevel('INFO');
    return logger;
}









