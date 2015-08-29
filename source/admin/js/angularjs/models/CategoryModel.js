/**
*
*  category model for my self  
*
*/
MetronicApp.factory('CategoryModel',['$http','$q','$timeout',function($http, $q, $timeout){
	
		var Category = function(){
		
		
		}
		var PT = Category.prototype;
		/*
		 * create 
		 *
		 */
		PT.create = function(){
			
			var url = '/admin/category';

			var defer = $q.defer(),promise = defer.promise ;
			var fields =['name','value','scope','parent_id','order','status','_csrf'] ;
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
						defer.reject('create category failed:'+data.message);
					}
				})
				.error(function(response, status, headers, config){
					defer.reject('create category error:' + response);
				})
			return promise ;
		
		}


		/**
		 *  update
		 *
		 **/
		PT.update = function(){
		
			var url = '/admin/category';
			var defer = $q.defer() , promise = defer.promise ;
			var fields =['_id','name','value','order','status','_csrf'] ;
			var param = {}; 
			var that = this ;			
			//fill attributes
			fields.forEach(function(v,i){
					param[v] = that[v];
			});
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
						defer.reject('save category failed:' + data.message);
					}			
				})
				.error(function(response, status, headers, config){
					defer.reject('create category error:' + response);
				})

				return promise;
		}

		/*
		 * delete
		 *
		 */
		PT.del = function(){
			
			var url ='/admin/category';
			var defer = $q.defer() , promise = defer.promise ;
			var that = this ;	
			if(!that._id){
				$timeout(function(){
					defer.reject('_id must not empty!')			
				},0);
				return promise ;
			} 
			
			$http({method:"delete",url:url+'/'+ that._id,headers:{ 
					'Content-Type'	:'application/x-www-form-urlencoded;charset=utf-8'
				},params:{"_csrf":this._csrf}})
				.success(function(data){
					if(data.errno == 0 ){
						defer.resolve(that._id);
					}else{
						defer.reject('delete category failed,id:'+that._id,',message:'+data.message); 
					}		
				})
			return promise;
		}
		/*
		 * get
		 *
		 */
		PT.get = function(){
			var url ='/admin/category';
			var defer = $q.defer() , promise = defer.promise ;
			if(!this._id){
				$timeout(function(){
					defer.reject('_id must not empty!')			
				},0);
			}   
			
			$http.get(url+'/' +this._id,function(data){
				if(data.errno == 0 ){
					defer.resolve(data.data);
				}else{
					defer.reject('delete category failed,id:'+this._id,',message:'+data.message); 
				}		
			})
			return promise;
		}

		//static method 
		Category.getList = function(scope,parent_id){
			var url = '/admin/categories';
			var defer = $q.defer() , promise = defer.promise ;
			
			$http.get(url,{params : {scope:scope,parent_id:parent_id||""}})
				.success(function(data){
					if(data.errno == 0){
						defer.resolve(data.data)
					}else{
						defer.reject('get categories fail:'+data.message);
					}	
				})
				.error(function(response, status, headers, config){
					alert('get categories error:'+response);	
				})
			return promise;	
		}

		//convert treenode to 
		Category.formatToTreeNode = function(node){
			
			if(Object.prototype.toString.call(node) =='[object Object]'){
				node.id =node._id ||'';
				node.text = node.name ;
				if(node.children && node.children.length > 0) {
					node.icon="fa fa-folder";
				}else{
					node.icon = "fa fa-file";
				}
				node.parent = node.parent_id.replace(/0/g,'') =='' ? '#':node.parent_id; 
			}
			if(Object.prototype.toString.call(node) =='[object Array]'){
				node.forEach(function(v,i){
					Category.formatToTreeNode(v);
				})
			}
			return node ;
		}
		return Category;
}])
