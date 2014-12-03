/**
*   config for all 
*/


var path = require('path');
var rootPath = path.join(path.normalize(__dirname + '/..') + '/')

var config = {
    
        'development' :{
            debug:true,
            db : "mongodb://febody:febody@localhost:17017/febody" ,  
            rootpath : rootPath ,
            name : "前端body",
            keywords:"javascript,html,css",
            port : 13003 ,
            host :"http://182.92.98.242",
            session_secret:'febody-session-secret',
            auth_cookie_name:'febody',
            admins:{user_login_name : true },
            upload:{
                path:path.join(rootPath,'uploads/')
            }
         },
         'online':{
                         
             
          }
    
}



module.exports = config;
