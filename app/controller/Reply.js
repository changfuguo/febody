/*
 * admin controller 
 * author:jsjiker
 * date  :2015-06-01
 */

var Topic  = require('../proxy').Topic;
var Category   = require('../proxy').Category;
var Reply   = require('../proxy').Reply;
var validator      = require('validator');
var authMiddle  = require('../../middlewares/auth');
var config = require('../../config/config');
var q = require('q');
var moment = require('moment');
//addFromFront

var utils = require('../../components/utils');
var url = require('url');
exports.addFromFront = function (req, res, next) {

	var author = validator.trim(req.body.author);
	var email = req.body.email;
	var content = validator.trim(req.body.content);
	var topic_id = validator.trim(req.body.topic_id || '');
	var parent_id = req.body.parent_id || '';

	//check topic_id
	var headers = req.headers;
	var reffer = headers['referer'];
	var ua = headers['user-agent'];
	var ip = utils.getClientIP(req);
	if(topic_id == '' || !validator.isEmail(email) || author == '' || content == '') {
		res.render('500',{
			error:"文章不存在或邮件、作者、内容不合法",
			redirectUrl : reffer
		});
		res.end();
	}
	Topic.getTopicById(topic_id)
		.then(function (topic){

			if (!topic) {
				res.render('500',{
					error:"文章不存了",
					redirectUrl : reffer
				});
				res.end();
			}
			Reply.create({
				topic_id : topic_id,
				parent_id: parent_id,
				author : author,
				email: email,
				content: content,
				ip: ip,
				ua: ua
			})
			.then(function (r) {
				if (r) {
					Reply.countByTopic(topic_id, 1)
						.then(function (number){
							//update topic 
							topic.reply_count = number;
							topic.last_reply_at = + new Date();
							topic.save();
						})
					res.redirect(reffer);
					
				} else {
					res.render('500',{
						error:"未知原因添加失败了",
						redirectUrl : reffer
					});
				}
			})

		})
		.fail(function (err) {
			res.render('500',{
				error:"文章不存了",
				redirectUrl : reffer
			});
			
		})
}
