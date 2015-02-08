/**
* data proxy ,for controller usage ,bacause we can load ejs or api ,all from here
* author : changfuguo
* date   : 2015-01-18
*/

var mgs = require('mongoose');
var User = mgs.model('User');
var q = require('q');

/**
* find user by login name
* @param {String} loginName  ,login user's name
*
* @return {Function} return promise
*/


exports.getUserByLoginName = function(names){
    
    var defer = q.defer();
    //check names 's legth 
    if(names.length == 0){
        
    }
    
    return defer.promise ;
}
