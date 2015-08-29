var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var q = require('q');
var ReplySchema = new Schema({
        content:{type: String },
        topic_id:{type: ObjectId},
        create_at:{type: Number, default: Date.now },
        author:{type: String},
        email: {type: String},
		ip: {type: String},
		ua: {type: String},
		parent_id: {type: ObjectId},
		status: {type: Number}  //-1 删除  0 未审核  1 审核通过
});

//static method 
var statics = ReplySchema.statics = {};

/*
 * 得到评论数量 根据topid status
 * @param{string} topicid 
 * @param{string} status 
 *
 */
statics.countByTopic = function (topicid, status) {
	
	var defer  = q.defer(), promise = defer.promise;
	var cond = {topic_id: topicid};
	if(status ==  -1 || status  == 0 || status == 1) {
		cond.status = status;
	}

	Reply.count(cond, function (err,total) {
		if (err) {
			return defer.reject('查询错误' + err);
		}
		defer.resolve(total);
	});
	return promise;
}

/*
 * 得到评论 根据topid status
 * @param{string} topicid 
 * @param{string} status 
 *
 */
statics.getRepliesByTopic = function (topicid, status) {
	
	var defer  = q.defer(), promise = defer.promise;
	var cond = {topic_id: topicid};
	if(status ==  -1 || status  == 0 || status == 1) {
		cond.status = status;
	}

	Reply.find(cond)
		.sort({create_at:-1})
		.exec(function (err,list) {
			if (err) {
				return defer.reject('查询错误' + err);
			}
			defer.resolve(list);
		});
	return promise;
}
ReplySchema.index({topic_id: 1});

var Reply = mongoose.model('Reply',ReplySchema);
