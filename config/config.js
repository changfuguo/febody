/**
*   config for all 
*/


var path = require('path');
var rootPath = path.join(path.normalize(__dirname + '/..') + '/')

var config = {
    
            debug:true,

            db : "mongodb://febody:febody@localhost:17017/febody" ,  
            rootpath : rootPath ,
            name : "前端body",
            keywords:"javascript,html,css",
            port : 13003 ,
            host :"http://127.0.0.1",
            session_secret:'yours secret', // session secret 
            session_timeout : 24 * 60 * 60,
            auth_cookie_name:'your cookie name',              // powerful user name
            //topic list count
            list_topic_count : 20 ,
            admins:{user_login_name : true },
            upload:{
                path:path.join(rootPath,'/public/uploads/'),
                url : '/public/uploads/'
            }
			,menuPath : rootPath + 'config/menu.json'
			,category_scopes :[{name:"文章类",value:"article"},{name:"权限类",value:"permission"}]
}



module.exports = config;
