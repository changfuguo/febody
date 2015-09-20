/**
*  comment model for my self  
*/
MetronicApp.factory('CommentModel',['$http','$q','$timeout',
		function($http, $q, $timeout){
	
		var Comment = function(){
		};
		var PT = Comment.prototype;
		/*
		 * create 
		 *
		 */
		Comment.status = {
			"1"	:	"审核通过",
			"0"	:	"审核中",
			"-1":	"已删除"
		};
		/*
		 * publish
		 *
		 */
		PT.publish = function(){
			
			var url ='/admin/comment';
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
			
			var url ='/admin/comment';
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
						defer.reject('delete comment failed,id:'+that._id,',message:'+data.message); 
					}		
				})
			return promise;
		}
		// static method 
		Comment.getList = function(condition){
			
			var id = condition.id;
			var url = '/admin/topic/'+ id +'/comments';
			var defer = $q.defer() , promise = defer.promise ;
			
			$http.post(url,condition)
				.success(function(data){
					if(data.errno == 0){
						defer.resolve(data.data)
					}else{
						defer.reject('get comments fail:'+data.message);
					}	
				})
				.error(function(response, status, headers, config){
					alert('get comments error:'+response);	
				})
			return promise;	
		}
		return Comment;
}])
