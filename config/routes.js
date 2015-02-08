/*
* routes for all ,collection 
* @author:changfuguo
* @date:2015-02-06
*/

var config = require('./config');
var fs = require('fs');

module.exports =  function(app){
    
    var routes_path  = config.rootpath + '/app/routes';
    fs.readdirSync(routes_path).forEach(function(file){
         //just loaded Ruotes file 
         if(~file.indexOf('.js') && file.substr(-3) == '.js'){
             require(routes_path + '/' + file)(app);
          } 
    })

}
