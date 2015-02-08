/**
*   config for all 
*/


var path = require('path');
var rootPath = path.join(path.normalize(__dirname + '/..') + '/')

var config = {
    
            debug:true,

            db : "mongodb://test:test@localhost:17017/test" ,  
            rootpath : rootPath ,
            name : "前端body",
            keywords:"javascript,html,css",
            port : 13003 ,
            host :"localhost",
            session_secret:'test', // session secret 
            session_timeout : 24 * 60 * 60,
            auth_cookie_name:'testtesttest',              // powerful user name
            //topic list count
            list_topic_count : 20 ,
            admins:{user_login_name : true },
            upload:{
                path:path.join(rootPath,'/public/uploads/'),
                url : '/public/uploads/'
            }
}



module.exports = config;
