/**
* data proxy ,for controller usage ,bacause we can load ejs or api ,all from here
* author : changfuguo
* date   : 2015-01-18
*/

var mgs = require('mongoose');
var q = require('q');
var utils = require('utility');
var config = require('../../config/config');
var fs = require('fs');
var validator = require('validator');
var beautify = require('js-beautify').js_beautify;
/*
 * get memu json config
 *
 */
exports.getMenu = function(){
	var defer = q.defer(), promise = defer.promise;
	var menufile = config.menuPath;

	if(!fs.existsSync(menufile)){
		fs.writeFileSync(menufile,'');	
	}

	var ret = '';

	//read file 

	fs.readFile(menufile,{encoding:'utf-8',flag:'r'},function(err,data){
		
			if(err){
				return defer.reject('read menu error:'+err);
			}
			if(!validator.isJSON(data)) return defer.reject('data is not json:' + data);
			data = JSON.parse(data);
			return  defer.resolve(data);	
	})
	return promise;
}

/*
 * save data to menu.json
 *
 */

exports.saveMemu = function(data){

	var defer = q.defer(), promise = defer.promise;
	var menufile = config.menuPath;

	if(!fs.existsSync(menufile)){
		fs.writeFileSync(menufile,'');	
	}
	var type = Object.prototype.toString.call(data);
	if(type == '[object Object]'){
		data = JSON.stringify(data);
	}
	if(!validator.isJSON(data)){
		process.nextTick(function(){
			defer.reject('data is not a valid json format');		
		})
		return promise;
	}

	data = beautify(data);
	fs.writeFile(menufile,data,{encoding:'utf-8',flag:'w'},function(err){
		if(err){
			defer.reject('write file error:'+err);
			return false ;
		}
		defer.resolve(true);
	})	
	return promise;
}
