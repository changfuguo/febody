'use strict';

MetronicApp.controller('CategoryManageController',['$rootScope', '$scope', '$http', '$timeout','CategoryModel','SecurService', function($rootScope, $scope, $http, $timeout,Category,SecurService) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        Metronic.initAjax();
    });
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageBodySolid = true;
    $rootScope.settings.layout.pageSidebarClosed = false;
	
	$scope.scopes = [{name:"文章",value:"article"}]
	//当前scope下的分类
	var categories = $scope.categories = [];

	var _reserves = {};
	var that = $scope ;
	
	$scope.selected_node = {};
	var category = $scope.category = {};
	category.status = 1 ;
	//save category
	$scope.save = function(){
		//save
		category.scope = this.scope;
		category._csrf = SecurService.csrf();
		var model = new Category();
		angular.extend(model,category);

		if(category._id && category._id.length == 24){
			model.update()
				.then(function(data){
					getListByScope($scope.scope);					
				},function(err){
					alert(err);
			})
		}else{
			model.create()
				.then(function(data){
					getListByScope($scope.scope);					
				},function(err){
					alert(err);
			})
		}
	};

	//clear category 
	function clearCategory(){
		category._id = '';
		category.name = '' ;
		category.value = '';
		category.status = 1 ;
		category.order = 0 ;
		category.parent_id ='';
		category.parent_name ='';
	}
	//set status 
	$scope.setStatus = function(status){
		$scope.category.status = status;
	}
	//get all list 
	function getListByScope (scope){
		Category.getList(scope)
			.then(function(data){
				$scope.categories = Category.formatToTreeNode(data);
				$scope.categories.forEach(function(v,i){
						_reserves[v._id] = v;
						v['children_ex'] = v['children'];
						delete v['children'];
				})
				setTree();
			},function(err){
				alert(err);
			})
	}
	//set tree
	var jsTree ;
	function setTree(){
		$("#treecategory").jstree("destroy");
		
		jsTree = $('#treecategory').jstree({
			"plugins":['contextmenu'],				
			"core":{
				"worker":false,
				"animation" : 1,
				"themes":{
					"response":false
				},'data': $scope.categories
			},
			"contextmenu":{
					"ccp":false,
					"items":createContextMenus,
					"select_node":true
				}		
		})

	}

	//create contextmenu for right click
	function createContextMenus(node){
	
		var items = {};
		var ori = node.original;
		//create first level category 

		items.createTopNode = { 
			label :"创建一级",
			action:function(item){
				$scope.$apply(function(){	
					$scope.category.parent_id ="";
					$scope.category.parent_name ="";
					$scope.category.status = 1 ;
					$scope.category.order = 0 ;
					$scope.category.name ="";
					$scope.category.value="";
					$scope.category._id ="";
				});
			},
			"separator_after": true,
			_disabled:false,
			icon :"fa fa-plus-square"
		};

		//create child node
		items.createChildNode = {
			label:"创建子节点",
			action:function(item){
				$scope.$apply(function(){	
					category.parent_id = ori._id;
					category.parent_name = ori.name;
					category.status = 1 ;
					category.order = 0 ;
					category.value = "";
					category.name = "";
					category._id = "";
				});
			},
			separator_after : true,
			icon:"fa fa-plus"
		}


		//update node
		items.updateNode = {
			label:"更新节点",
			action:function(item){
				$scope.$apply(function(){	
						category.parent_id = ori.parent_id;
						category.parent_name =( _reserves[ori.parent_id] || {}).name || "" ;
						category.status = ori.status ;
						category.order = ori.order ;
						category.name= ori.name;
						category.value= ori.value;
						category._id = ori._id;
				});
			},
			separator_after:true,
			icon:"fa fa-edit"
		
		};
		//delte node
		items.deleteNode ={
			label:"删除节点",
			action:function(node){
				var id  = ori._id ;
				$scope.category._id = id ;
				if(confirm('确定删除节点['+ ori.name+']?')){

					var model  = new Category();
					model._id = ori._id ;
					model._csrf = SecurService.csrf();  
					model.del()
					.then(function(data){
						$scope.category._id ='' ;	
						$scope.category.name ='' ;	
						$scope.category.value ='' ;	
						$scope.category.parent_id ='' ;	
						$scope.category.parent_name ='' ;	
						$scope.category.status = 1 ;	
						$scope.category.order ='' ;	

						getListByScope($scope.scope);					
					},function(err){
						alert(err);
					})
				}
			},
			_disabled: ( node.children_ex||[]).length > 0,
			icon:"fa fa-remove"
		}
		
		//return 
		return items;
	}
	$scope.changeScope= function(){
		getListByScope($scope.scope);
	}

}]);
