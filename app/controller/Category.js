/*
 * admin controller 
 * author:jsjiker
 * date  :2015-06-01
 */

var Category   = require('../proxy').Category;
var validator      = require('validator');
var authMiddle  = require('../../middlewares/auth');
var config = require('../../config/config');


exports.index = function(req, res, next){
   
   res.render('index',{
        message :"hi yare here!"    
       
   });
}
/*******/
exports.create = function(req, res, next){

	var scope = validator.trim(req.body.scope);
	var name = validator.trim(req.body.name);
	name = validator.escape(name);
	var value = validator.trim(req.body.value);
	value = validator.escape(value);
	var status = req.body.status;
	var order = req.body.order;
	var parent_id = req.body.parent_id || '';

	var result = {};

	if(scope == '' || value == '' || name == '' || status == ''|| !validator.isNumeric(order)){
			result.errno = 1 ;
			result.message = '字段填写不完整请检查';
			result.data=null;
			res.status(200).json(result);
			res.end();
	}	
	Category.create(scope, name,value,parent_id,order,status)
		.then(function(category){
			result.errno = 0;
			result.message ="";
			result.data = category;
			res.status(200).json(result);
		},function(err){
			result.errno = 1 ;
			result.message = err;
			result.data=null;

			res.status(200).josn(result);
		})

}
	
/**
 * get list for category
 */

exports.getList = function(req,res,next){
	
	var scope = validator.trim(req.query.scope);
	var parent_id = validator.trim(req.query.parent_id);
	var result = {errno : 0 , message:"",data:""};
	Category.getList(scope,parent_id)
		.then(function(docs){
			result.data = docs ;
			res.status(200).json(result);
		})
		.fail(function(err){
			result.errno = 1 ;
			result.message = err;
			res.status(200).json(result);
		})

}



/**
 * update 
 *
 **/

exports.update = function(req,res,next){

	var scope = validator.trim(req.body.scope);
	var name = validator.trim(req.body.name);
	name = validator.escape(name);
	var value = validator.trim(req.body.value);
	value = validator.escape(value);
	var status = req.body.status;
	var order = req.body.order;
	var id = req.body._id + '';
	var result = {};
	console.log(req.body);
	if( value == '' || id.length != 24  || name == '' || status == ''|| !validator.isNumeric(order)){
			result.errno = 1 ;
			result.message = '字段填写不完整请检查';
			result.data = null;
			res.status(200).json(result);
			res.end();
	}	
	
	Category.update(id ,{name:name,value:value,status:status,order:order})
		.then(function(category){
			result.errno = 0;
			result.message ="";
			result.data = category;
			res.status(200).json(result);

		},function(err){
				
		})

}


/*
 * delete a node by id
 *
 */

exports.delete = function(req,res,next){

	var id = req.params.id;
	Category.removeById(id)
		.then(function(err){
			if(err){
				res.status(200).json({
					errno : 1,
					message:'delete category failed' + err
				});
				res.end();
			}
				res.status(200).json({
					errno : 0,
					message:''
				});
				res.end();
			});
}
