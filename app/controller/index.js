/*
* node site index controller
* author:changfuguo
* date  :2015-01-27
*
*/


var proxy = require('../proxy');

var User = proxy.User ;
var Topic = proxy.Topic ;
var config = require('../../config/config');



//index method

exports.index = function(req, res, next){
   
   res.render('index',{
        message :"hi yare here!"    
       
   });
}

