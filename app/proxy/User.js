/**
* data proxy ,for controller usage ,bacause we can load ejs or api ,all from here
* author : changfuguo
* date   : 2015-01-18
*/

var mgs = require('mongoose');
var User = mgs.model('User');
var q = require('q');
var utils = require('utility');
/**
* find user by login name
* @param {String} loginName  ,login user's name
*
* @return {Function} return promise
*/


exports.getUserByLoginName = function(name){
    
    var defer = q.defer();
    //check names 's legth 
    User.findOne({'loginname':name},function(err,user){
				
		if(err) {
			return defer.reject('查询失败：'+err);
		}
		defer.resolve(user);
	})
	
	return defer.promise ;
}
/**
* find user by id
* @param {String} id  , id
*
* @return {Function} return promise
*/
exports.getUserById = function(id){
    var defer = q.defer();
    //check names 's legth 
    User.findOne({'_id':id},function(err,user){
			if(err) {
				//log
				return defer.reject('查询失败：'+err);
			}
			defer.resolve(user);
	})
	
	return defer.promise ;
}
/**
 * compare current username and password 
 ***/
exports.comparePassword = function(username,password,user){
	
	var encoder = utils.md5(username + password);
	return utils.md5(username + password) === user.pass;	

}
