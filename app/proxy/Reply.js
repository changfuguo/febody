/**
* Reply data proxy
* author :changfuguo
* date   :2015-01-26
*
*/


var mongoose  = require('mongoose');
var Reply = mongoose.model('Reply');
var q = require('q');

var User = require('./User');


/*
* get a reply message
* @param{String} id 
*
* @return {Function} return promise 
*
*/

exports.getReply = function(id){
    var defer = q.defer();
    return defer.promise ;
}
