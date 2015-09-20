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

var DEFAULT_ID = '000000000000000000000000';
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

/*
 * create a new reply comment
 * @parem{Object} 
 *					topic_id{string}	required
 *					parent_id{string}	not must ,default is '000000000000000000000000'
 *					author{string}		required
 *					author_email{string}		required
 *					content{string} required
 *					ip{string} not required
 *					ua{string} not required
 *					status{string} not required 
 *					
 *					

 */
exports.create = function(reply) {
	
	var copy = new Reply() , defer = q.defer(), promise = defer.promise;
	copy.parent_id = reply.parent_id || DEFAULT_ID;
	//check topic 
	q.spread([ copy.parent_id == DEFAULT_ID || getReplyById(copy.parent_id)], function(comment) {

		if(comment && comment !== DEFAULT_ID) {
			copy.parent_id = comment._id;
		}
		//save 
		copy.topic_id = reply.topic_id;
		copy.author = reply.author;
		copy.email = reply.email;
		copy.content = reply.content;
		copy.ip = reply.ip;
		copy.ua = reply.ua;
		copy.status = '1';//default is 0 for test
		copy.save(function(err,r) {
			if(err) return defer.reject(err);
			return defer.resolve(r)
		})
	})
	.fin(function(){
		copy = null;		
	})

	return promise
}

var getReplyById = exports.ReplyById = function (id) {
	var defer = q.defer();
	Reply.findOne({_id: id},function(err,reply){
		if(err) {
			return defer.reject('get topic err' + err);
		}		   
		return defer.resolve(reply);
	})
   return defer.promise ;
}
// update 
exports.update = function(id,reply){

	var defer = q.defer();
	if(!id){
		process.nextTick(function(){
			defer.reject('_id 不能为空');		
		});
		return defer.promise;
	}

	if(reply['_id']) delete reply['_id'];
	
	Reply.update({_id: id} , {$set: reply}, function(err,item){
		if(err) {
			return defer.reject('update reply error'+err);
		}		
		defer.resolve(item);
	})
	return defer.promise;
}


exports.countByTopic = Reply.countByTopic;
exports.getRepliesByTopic = Reply.getRepliesByTopic;
