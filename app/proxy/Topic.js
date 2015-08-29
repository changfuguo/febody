/**
* model data proxy ,here we output data
*
* author:changfuguo
* date  :2015-01-26
*/

var mongoose = require('mongoose');
var Topic = mongoose.model('Topic');
var Reply = mongoose.model('Reply');
var Category = require('./Category');

var q = require('q');
/**
* get topic by topic id
* 
* @param {String} id  topic id 
* @return {Function} return promise
*/
var CREATE_FIELDS = ["title","content","top","good","category_id","tags",'status'];
var UPDATE_FIELDS = ["_id","title","content","top","good","category_id","tags","last_reply",'status'];

var checkFields = function(array, obj){
	var temp ={} ;
	
	array.forEach(function(v,i){
		if(obj[v]) temp[v] = obj[v];		
	})
	return temp;
}

/*
 * get topic by id 
 *
 **/
exports.getTopicById = function(id){
   var defer = q.defer();
   Topic.findOne({_id: id},function(err,topic){
		if(err) {
			return defer.reject('get topic err' + err);
		}		   
		return defer.resolve(topic);
   })
   return defer.promise ;
}

/*
 * create topic by object , me must limit the key for secuirty
 * @param {Object} topic 
 * @return {Function} return promise
 */
exports.create = function(topic){
	    
	var defer = q.defer();
	topic = checkFields(CREATE_FIELDS, topic);

	//save
	Topic.create(topic,function(err,small){
		if(err) {
			return defer.reject('save topic error:'+ err);
		}
		defer.resolve(small);
	})

	return defer.promise;
}
/*
 * update by object ,here we must limit the fields we update
 * @param {Object} topic
 * @return {Function} 
 */

exports.update = function(id,topic){

	var defer = q.defer();
	topic = checkFields(UPDATE_FIELDS, topic);

	if(!topic._id ){
		process.nextTick(function(){
			defer.reject('_id 不能为空');		
		});
		return defer.promise;
	}
	topic.update_at = +new Date() ;

	if(topic['_id']) delete topic['_id'];
	
	Topic.update({_id: id} , {$set: topic}, function(err,item){
		if(err) {
			return defer.reject('update topic error'+err);
		}		

		defer.resolve(item);
	})
	return defer.promise;
}


var CONST_STATUS = exports.CONST_STATUS = {
	"-1" :{
		value :"已删除"
	},
	"0":{
		value:"存草稿"
	},
	"1":{
		value:"已发布"	
	}
}
var CONST_DEFATUL_CATEGORY_ID  = '000000000000000000000000';
/*
 * query by condition ,if query by the parameters below , you can use this function
 * @param{Object} condition 
 *		status		{Number}  just -1 ,0 ,1 can be accepted
 *		top			{Boolean} true or false , or not be set
 *      good		{Boolean} true or false
 *      category_id	{String}  we search by category_id or who's parent category_id is 
 *      start_date  {Number}  create_date 
 *      end_date    {Number}  end_date
 *      context	    {String} search context
 *
 * @page{Object} pageInfo
 *		pageSize	{Number} pagesize ,default is 20
 *		currentPage	{Number} currentpage ,default is 1
 * @order[{field:{String},order:{Number}]
 */


exports.query = function(param, page, order){

	var defer = q.defer(),promise = defer.promise;

	var query = Topic.find({});

	var argsLen = arguments.length ;

	if(argsLen == 1){
		page = {};
		page.currentPage = page.currentPage || 1 ;
		page.pageSize = page.pageSize || 20 ;
	}
		
	order = order || {"update_at":-1}

	if(param.context !== undefined && param.context.replace(/\s+/g,'') != ''){
		var regC = new RegExp(param.context);
		query = query.find({$and: [{ $or: [ {title: regC}, {content: regC}]}] }); //title content to query	
	}

	if(param.status !== undefined && CONST_STATUS[param.status]){
		query = query.where('status',param.status);
	}

	if(param.top !== undefined ){
		param.top = param.top - 0;
		query = query.where('top',!!param.top);
	}
	
	if(param.good !== undefined ){
		param.good = param.good - 0;
		query = query.where('good',!!param.good);
	}	

	if(param.start_date !== undefined){
		query = query.where('create_at').gt(param.start_date);	
	}
	
	if(param.end_date !== undefined){
		query = query.where('create_at').lt(param.end_date);	
	}
	
	//var category_id = param.category_id || CONST_DEFATUL_CATEGORY_ID ;
	var category_id = param.category_id ;// '559bde595a92712827b0c76c';
	//we can add cache layer here for speed up 

	//if (cache[id]) categories.push(xxxx);

	//get all 


	Category.getGrandsonById(category_id)
		
		.then(function(list){

			var categories = [];

			if(list.length && list.length > 0){
				list.forEach(function(v,i){
					categories.push(v._id);	
				});	
				//here we go
				query = query.where('category_id').in(categories);
			}
			query = query.skip((page.currentPage - 1) * page.pageSize);
			query = query.limit(page.pageSize);
			query = query.sort(order);
			query = query.select('title top good content status view_count reply_count create_at update_at category_id');
			
			//first we get all number 
			//console.log(query._conditions);
			Topic.count(query._conditions ,function(err,count){
				if(err){
					defer.reject('get total count err:' + err);
				}else{
					query.exec(function(err,list){
						if(err)	{
							return defer.reject(err);
						}
						return defer.resolve({	
								listInfo : list ,
								pageInfo : {
												totalNumber : count ,
												pageCount   : Math.ceil(count / page.pageSize),
												currentPage : page.currentPage,
												pageSize    : page.pageSize 
											}
								});
					})
				}
			})
		})
		.fail(function(err){
				console.log(err)	
				defer.reject(err);
		})
		.fin(function(){
			categories = null;
			qeury = null;
		});
		
		return promise ;
}


/*
 * 根据id更新期评论数，这里只更新可以显示的评论数
 * @param{string} id    topic id
 * @param{status} status 
 */
exports.updateCommentNumber = function (id) {

	var defer  = q.defer(), promise = defer.promise;
	Reply.countByTopic(id, 1)
		.then(function (number) {
			console.log(number,id);
			Topic.update({_id: id }, {$set :{reply_count: number, last_reply_at: +new Date()}}, function (err, raw) {
				if(err) return defer.reject('更新文章信息失败:' +err);
				defer.resolve(raw)
			}) 			
		})
}

