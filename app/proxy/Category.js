/**
* data proxy ,for controller usage ,bacause we can load ejs or api ,all from here
* author : changfuguo
* date   : 2015-01-18
*/

var mgs = require('mongoose');
var Category = mgs.model('Category');
var q = require('q');
var utils = require('utility');


var config = require('../../config/config');

var CONST_DEFAULT_ID = exports.DEFAULT_ID = '000000000000000000000000';
/**
 * @param {String} name  分类名称
 * @param {String} value 分类展现的值
 * @param {String} parent_id 父亲节点值
 * @param {Number} order 排序值 
 * @param {Boolean} status 状态值   1:可用；0：不可用
 **/
exports.create = function(scope,name, value, parent_id, order, status){

	var defer = q.defer(),promise = defer.promise;

	var save = function(param){
		var saveDefer = q.defer(),savePromise = saveDefer.promise;
		Category.create(param,function(err,doc){
			if(err) {
				return saveDefer.reject('['+__dirname+'][create] create category failed:' +err);
			}
			saveDefer.resolve(doc);
		})
		return savePromise;
	}
	//check parent_id
	var param ={} ;
	
	param.name = name ;
	param.value = value;
	param.order = order;
	param.status = status;
	param.scope = scope;
	
	if(parent_id == ''){
		param.level = 1;
		return	save(param);	
	}
	//先查找父亲节点ID
	var parent_node =null;
	findById(parent_id)
		.then(function(doc){
			if(!doc) return defer.reject('parent node is not exists');
			parent_node = doc ;
			param.parent_id = doc._id;
			param.level = doc.level + 1;
			param.path = doc.path.concat(doc._id);
			return param;
		})
		.then(save)
		.then(function(category){
			if(!category) defer.reject('save category failed');	
			parent_node.children.push(category._id);
			parent_node.save(function(err){
				parent_node = null;
				if(err) return defer.reject('update parent node failed');
				defer.resolve(category);
			})
		})
		.fin(function(){
			parent_node = null;

		})

	return promise;
}


var reduceChildren = exports.reduceChildren = function(parent_id,child_ids,plus){

	child_ids = typeof child_ids =="string" ?  [child_ids] : child_ids;
	plus =  plus =='+' ? function(source,sub){
		sub = sub.filter(function(v){ return source.indexOf(v) < 0});
		return source.concat(sub);
	}:plus == '-'?
	function(source,sub){
		source = source.filter(function(v){
			return sub.indexOf(v) < 0;		
		});
		return source;
	}:function(source,sub){
		return source;
	}
	var defer = q.defer() ,promise = defer.promise;

	findById(parent_id,function(err,doc){
			doc.children = plus(doc.children,child_ids);
			doc.save(function(err){
				if(err) return defer.reject('save children failed');
				defer.resolve(doc);
			})
	})

	return promise;

}


/**
 *
 * @param {String} id
 *
 *
 **/
var findById = exports.findById = function(id){

	var defer = q.defer(),promise = defer.promise;
	Category.findById(id,function(err,doc){
		if(err){
			return defer.reject('['+__dirname+'][findById]find category failed:' + err.message);
		}	

		defer.resolve(doc);
	})

	return promise;
}


/**
 * get list by parent_id 
 * 
 * @param {String} scope 作用域
 * @param {String} parent_id 父亲ID
 **/

exports.getList = function(scope,parent_id){

	 var defer = q.defer(),promise = defer.promise;	
	 var query ={scope:scope};

	 if(parent_id) query.parent_id = parent_id;
	 Category.find(query)
		 .sort('-order')
		 .select('_id name value order status parent_id children path ')
		 .exec(function(err,docs){
				 if(err) return defer.reject('query categor list fail :'+err);
				 return defer.resolve(docs);
		  })
	 return promise;
}

/**
 * update category
 *
 **/


exports.update = function(id,param){

	var defer = q.defer(), promise = defer.promise;
	Category.findByIdAndUpdate(id,{$set:param},function(err,data){
		if(err){
			defer.reject('更新失败:' + err);
			return false;
		}	
		
		defer.resolve(data);
	});
	return promise;
}

exports.removeById = function(id){

	var defer = q.defer(),promise = defer.promise ;
	
	findById(id)
		.then(function(category){
			if(!category){
				return defer.reject('err,cateory is not exists');
			}
			var parent_id = category.parent_id + '';
			if(parent_id.replace(/0/g,'') != ''){
				findById(parent_id).then(function(cat){
					console.log('parent',cat);
					if(!cat ){
						return false
					}
					var index = cat.children.indexOf(category._id);
					cat.children.splice(index,1);
					cat.save();
				})
			}
			//remove self
			category.remove(function(err){
				if(err){
					return defer.reject('remove category failed :'+err);
				}
				defer.resolve(false);
			});
		});
	return promise;
}


/*
 * get grandson's by id 
 *
 */

exports.getGrandsonById = function(id){

	var defer = q.defer(), promise = defer.promise;
	
	//judge if id is '' or DEFAULT 
	id = id || '';
	if( id === '' || id === CONST_DEFAULT_ID){
		process.nextTick(function(){
			if(id === ''){
				return defer.resolve(false);
			}

			if( ID === CONST_DEFAULT_ID){
				return defer.resolve([{"_id": CONST_DEFAULT_ID ,name : "未分类",order: 0}]);
			}
		});

		return promise;
	}
	var query = Category.find({
		 // "$where" : 'this.path.indexOf("'+id+'") > -1 '
		   $or : [{_id : id },{"path":id}]
	});
	query = query.select('_id name order') //
	query = query.sort({order : 1}); //order asc 
	
	//exec
	query.exec(function(err,list){
			
		if(err) {
			return  defer.reject(err);
		}		
		defer.resolve(list);
	})

	return promise ;
}
/*
 * 根据分类名称得到当前分类
 * @param {string} name 分类 value
 * @return {Object}
 */
exports.getCategoryByValue = function (name) {

	var defer = q.defer(), promise = defer.promise;
	Category.findOne({value: name}, function (err,cate) {
			if (err) {
				return defer.reject('find cate error');
			}
			return defer.resolve(cate);
	});
	return promise;
}
