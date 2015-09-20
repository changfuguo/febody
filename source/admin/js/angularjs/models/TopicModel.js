/**
*
*  category model for my self  
*
*/
MetronicApp.factory('TopicModel',['$http','$q','$timeout',function($http, $q, $timeout){
	
		var Topic = function(){
		
		
		}
		var PT = Topic.prototype;
		/*
		 * create 
		 *
		 */
		Topic.status  ={
		
			"1"	:	"已发布",
			"0"	:	"未发布",
			"-1":	"已删除"
		};

		PT.create = function(){
			
			var url = '/admin/topic';

			var defer = $q.defer(),promise = defer.promise ;
			var fields =['content','category_id','good','top','title','tags','status','_csrf'] ;
			var param = {}; 
			var that = this;	
			//fill attributes
			fields.forEach(function(v,i){
					param[v] = that[v];
			});
			$http.post(url, param)
				.success(function(data){
					if(data.errno == 0){
						defer.resolve(data.data);
					}else{
						defer.reject('create topic  failed:'+data.message);
					}
				})
				.error(function(response, status, headers, config){
					defer.reject('create topic  error:' + response);
				})
			return promise ;
		}


		/**
		 *  update
		 *
		 **/
		PT.update = function(){
			var url = '/admin/topic';
			var defer = $q.defer() , promise = defer.promise ;
			var fields =['_id','content','category_id','good','top','title','tags','status','_csrf'] ;
			var param = {}; 
			var that = this ;			
			//fill attributes
			fields.forEach(function(v,i){
					param[v] = that[v];
			});
			param.tags =  param.tags + '';
			if(!this._id){
				$timeout(function(){
					defer.reject('_id must not empty!')			
				},0);
				return promise ;
			}
			$http.put(url,param)
				.success(function(data){
					if(data.errno == 0){
						defer.resolve(data);
					}else{
						defer.reject('update topic failed:' + data.message);
					}			
				})
				.error(function(response, status, headers, config){
					defer.reject('update topic error:' + response);
				})
				return promise;
		}
		/*
		 * publish
		 *
		 */
		PT.publish = function(){
			
			var url ='/admin/topic';
			var defer = $q.defer() , promise = defer.promise ;
			var that = this ;	
			if(!that._id){
				$timeout(function(){
					defer.reject('_id must not empty!')			
				},0);
				return promise ;
			} 
			
			$http.post(url + '/publish', {"_csrf": this._csrf, id: that._id})
				.success(function(data){
					if(data.errno == 0 ){
						defer.resolve(that._id);
					}else{
						defer.reject('publish topic failed,id:'+that._id,',message:'+data.message); 
					}		
				})
			return promise;
		}

		/*
		 * delete
		 *
		 */
		PT.del = function(){
			
			var url ='/admin/topic';
			var defer = $q.defer() , promise = defer.promise ;
			var that = this ;	
			if(!that._id){
				$timeout(function(){
					defer.reject('_id must not empty!')			
				},0);
				return promise ;
			} 
			
			$http.post(url + '/del', {"_csrf": this._csrf, id: that._id})
				.success(function(data){
					if(data.errno == 0 ){
						defer.resolve(that._id);
					}else{
						defer.reject('delete topic failed,id:'+that._id,',message:'+data.message); 
					}		
				})
			return promise;
		}
		/*
		 * get
		 *
		 */
		PT.get = function(){
			var url ='/admin/topic';
			var defer = $q.defer() , promise = defer.promise ;
			if(!this._id){
				$timeout(function(){
					defer.reject('_id must not empty!')			
				},0);
			}   
			
			$http.get(url+'/' +this._id)
			.success(function(data){
				if(data.errno == 0 ){
					defer.resolve(data.data);
				}else{
					defer.reject('get topic  failed,id:'+this._id,',message:'+data.message); 
				}		
			})
			return promise;
		}

		//static method 
		Topic.getList = function(condition){
			var url = '/admin/topics';
			var defer = $q.defer() , promise = defer.promise ;
			
			$http.post(url,condition)
				.success(function(data){
					if(data.errno == 0){
						defer.resolve(data.data)
					}else{
						defer.reject('get topics fail:'+data.message);
					}	
				})
				.error(function(response, status, headers, config){
					alert('get topics error:'+response);	
				})
			return promise;	
		}
		return Topic;
}])
