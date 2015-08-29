/*
 * admin controller 
 * author:jsjiker
 * date  :2015-06-01
 */

var Topic  = require('../proxy').Topic;
var Reply  = require('../proxy').Reply;
var Category   = require('../proxy').Category;
var validator      = require('validator');
var authMiddle  = require('../../middlewares/auth');
var config = require('../../config/config');
var q = require('q');
var moment = require('moment');
var Walker = require('../../components/walker').Walker;
exports.index = function(req, res, next){
  
	var topic_id = req.params.id || '';
	if (topic_id.length != 24) {
		return res.render('404', {
			error:'您查找的资源不存在了！！'			
		});
	}
	var walker = new Walker({main_key:'_id',parent_key:'parent_id',children_key:'child',default_value:'000000000000000000000000'});
	q.spread([Topic.getTopicById(topic_id), Reply.getRepliesByTopic(topic_id)], function (topic,comments) {
		
		if(!topic){
			return res.render('404', {
				error:'您查找的资源不存在了！！'			
			});

		}
		topic.last_visit_at	= +new Date();
		topic.visit_count = topic.visit_count + 1;
		topic.save(function(err,t){
		});
		comments = comments || [];
		//get category value
		//topoc.reply and topic.recent_topics
		Category.findById(topic.category_id)
			.then(function (cat) {
				var item = {};
				if (!cat) {
					item.cat_value = 'none';
					item.cat_name  = '未分类';
				} else {
					item.cat_vaule = cat.value;
					item.cat_name = cat.name;
				}
				item.id = topic._id;
				item.title = topic.title;
				item.content = topic.content;
				item.update_at = topic.update_at;
				item.last_vist_at = topic.last_visit_at;
				item.tags = topic.tags;
				item.reply_count = topic.reply_count;
				item.good = topic.good ;
				item.top = topic.top;
				item.visit_count = topic.visit_count;
				res.render('front/pages/topic', {
					topic: item,
					comments : walker.process(comments),
					commentsCount: comments.length
				})
			})
	})
}
/*
 * 根据分类名称得到当前的文章，暂时没加分页
 */
exports.getTopicsByCategory = function(req ,res, next) {

	var value = req.params.name;
	value = validator.trim(value);
	if(value == '') {
		res.render('404',{
			error:'您查找的分类不存在'		
		});
		res.end();
	}


	// getCategoryByValue  getGrandsonById

	Category.getCategoryByValue(value)
		.then(function (cate) {
			if	(!cate) {
				res.render('404', {
					error : '您查找的分类不存在!'	
				});
				res.end();
			}
			return [Topic.query({status: 1 ,category_id: cate._id}),  Category.getList('article')];
		})
		.spread(function (data, cates) {
			var categoires = {};
			cates.forEach(function(v,i){
				categoires[v._id] = {
					id		:	v._id ,
					name	:	v.name ,
					value	:	v.value
				};
			})
			res.render('front/index',{articles :data, menus:res.locals.menus,categories : categoires});
		})
		.fail(function (err) {
			res.render('404', {
					error : '您查找的分类不存在!'	
			});
		})
}
/*******/
exports.create = function(req, res, next){

	var title = validator.trim(req.body.title);
	var content = req.body.content ;
	var top = req.body.top == '1'  ? true : false ;
	var good  = req.body.good == '1' ? true : false ;
	var category_id = validator.trim(req.body.category_id);
	var tags = req.body.tags || '';
	tags = tags.split(',');
	category_id = category_id ?category_id : Category.DEFAULT_ID;
	var status = parseInt(req.body.status);
	var user =  res.locals.current_user ;
	//save to db 
	var topic = {};
	topic.category_id = category_id ;
	topic.title = title ;
	topic.content = content ;
	topic.top = top ? true :false;
	topic.good = good ? true :false;
	topic.author_id = user._id ;
	topic.tags = tags ;
	topic.status = status;
	Topic.create(topic)
		.then(function(t){
			res.status(200).json({
				errno: 0 ,
				message: "",
				data: t
			})

		},function(err){
			res.status(200).json({
					errno : 1 ,
					message:err
				})
		})
}
	
/**
 * get list for category
 */

exports.getList = function(req,res,next){
	
	var status = req.body.status ;
	var top   = req.body.top - 0 ;
	var good = req.body.good - 0;
	var text = req.body.text || '';
	var category_id = req.body.category_id ;
	var start_date = req.body.start_date || ''  ;
	var end_date = req.body.end_date;
	//page set

	var currentPage = req.body.currentPage || 1  ;
	var pageSize = req.body.pageSize || 20;
	/////set condition 


	var condition = {};
	condition.pageSize = pageSize ;
	condition.currentPage = currentPage ;

	condition.status = status ;
	condition.top = top ;
	condition.good = good ;
	condition.context = text;
	condition.category_id = category_id;
	if(moment(start_date).isValid()){
		start_date = moment(start_date).format('x') -0 ; 
		condition.start_date = start_date;
	}		
	if(moment(end_date).isValid()){
		end_date = moment(end_date).format('x') -0 ; 
		condition.end_date = end_date ;
	}

	if(	moment(end_date).isValid() 
		&& moment(start_date).isValid() 
		&& moment(start_date).isAfter(end_date)){
		//just leave end_date

		delete condition['start_date'];
	}
	Topic.query(condition,{currentPage:currentPage,pageSize:pageSize})
		.then(function(data){
			res.status(200).json({errno: 0 , message: "" , data: data});
				
		},function(err){
			res.status(200).json({errno:1,message:err})
		})

}



/**
 * update 
 *
 **/

exports.update = function(req,res,next){
	console.log(req.body);
	var title = validator.trim(req.body.title);
	var content = req.body.content ;
	var top = req.body.top ? 1 : 0 ;
	var good  = req.body.good ? 1 : 0 ;
	var category_id = validator.trim(req.body.category_id);
	var tags = validator.trim(req.body.tags);
	tags = tags == '' ?[] : tags.split(',');
	category_id = category_id ?category_id : Category.DEFAULT_ID;
	var status = req.body.status ;
	var _id = req.body._id ;
	//save to db 
	var topic = {};
	topic._id = _id ;
	topic.title = title ;
	topic.content = content ;
	topic.top = top ? true :false;
	topic.good = good ? true :false;
	topic.tags = tags ;
	Topic.update(topic._id,topic)
		.then(function(t){
			res.status(200).json({
				errno : 0 ,
				message :""
			})

		},function(err){
			res.status(200).json({
					errno : 1 ,
					message:err
				})
		})

}

/*get by id **/

exports.get = function(req, res, next){

	var id = req.params.id;

	Topic.getTopicById(id)
	
		.then(function(topic){
			if(topic){
				res.status(200).json({errno : 0 ,data: topic, message: ''});
			}else{
				res.status(200).json({errno : -1 ,data: topic, message: ''});
			}
		},function(err){
				res.status(200).json({errno : 1 ,data: topic, message: ''});
		})
}

/*
 * delete a node by id
 *
 */

exports.delete = function(req,res,next){

}



/*
 * test
 *
 */

exports.test =  function(req,res,next){
	var id = req.query.id ;
	Category.getGrandsonById(id)
		.then(function(list){
			res.json(list);		
		},function(err){
		
			res.send(err);
		})
}
