/*
* node site index controller
* author:changfuguo
* date  :2015-01-27
*
*/


var proxy = require('../proxy');

var Menu = proxy.Menu ;
var config = require('../../config/config');



//index method

exports.getMenu = function(req, res, next){
  
	var result = {errno :0,message:'',data:''};
	Menu.getMenu()
		   .then(function(data){
				result.data = data;
				res.status(200).json(result);
			},function(err){
				  result.errno = 1 ;
				  result.message = err;
				  res.status(200).json(result);
			});
}
/*
 * save menu 
 **/

exports.saveMenu = function(req,res,next){

	var menuJson = req.body.q ;
	var result = {errno:0,message:"",data:''};
	try{
	Menu.saveMemu(menuJson)
		.then(function(data){
					result.data = JSON.parse(menuJson);
					res.status(200).json(result);
				},function(err){
					result.errno = 1 ;
					result.message = err;
					res.status(200).json(result);
				})
	}catch(e){
		console.log(e)
	}
}


