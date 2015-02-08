/**
* model data proxy ,here we output data
*
* author:changfuguo
* date  :2015-01-26
*/

var mongoose = require('mongoose');
var Topic = mongoose.model('Topic');

var User = require('./User');
var Reply = require('./Reply');

var q = require('q');
/**
* get topic by topic id
* 
* @param {String} id  topic id 
* @return {Function} return promise
*/

exports.getTopicById = function(id){
    
   var defer = q.defer();


   return defer.promise ;
}
