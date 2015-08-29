'use strict';
MetronicApp.controller('NavigatorController',['$rootScope', '$scope', '$http', '$timeout','CategoryModel','SecurService', function(
			$rootScope, $scope, $http, $timeout,Category,SecurService) {
	
	//declare list 
	$scope.list= [];
	$scope.categories = [];
	$scope.menus = [];
	var _reserves ={};

	var getCategoryList = function(){
		var scope = 'article';
		Category.getList(scope)
			.then(function(data){
				$scope.categories = Category.formatToTreeNode(data);
				$scope.categories.forEach(function(v,i){
					_reserves[v._id] = v;
					v['children_ex'] = v['children'];
					delete v['children'];
				});
				setTree();
			})
	}
	//set tree 
	var jsTree ;
	function setTree(){
		$("#category_tree").jstree("destroy");
		jsTree = $('#category_tree').jstree({
			"plugins":['checkbox'],				
			"core":{
				"worker":false,
				"animation" : 1,
				"themes":{
					"response":false
				},
				'data': $scope.categories
				},
				"checkbox":{
					"cascade":"undetermined",
					"tie_selection":false,
					"three_state":false,
					"keep_selected_style":false,
					"whole_node":false
				}
		})
	}
	/*
	 * set Menu tree node     [ 
	 *							text :"CSS"，
	 *							url :"http//www.baidu.com"
	 *							children:[{text:"css3",url:"http://www.baidu.com/css3"}]
	 *						  ]
	 */
	var menuTree ;
	function setMenuTree(){
		$("#menu_tree").jstree("destroy");
		jsTree = $('#menu_tree').jstree({
			"plugins":['dnd','contextmenu'],				
			"core":{
				"check_callback" : true,
				"worker":false,
				"animation" : 1,
				"themes":{
					"response":false
				},
				'data': $scope.menus
				},
				"contextmenu":{
					"ccp":false,
					"items":createNavMenu,
					"select_node":true
				}
			})
	}
	/**
	 * get menu tree
	 */
	function createNavMenu(){
		var items ={};
		var instance = $('#menu_tree').jstree(true);

		items.deleteItem = {
			label:"删除",
			action:function(node){
				instance.delete_node(instance.get_selected());
			}
		};
		return items;
	}
	/*
	 * get all memu from end
	 *
	 */	
	function getMenuList(){
		$http.get('/admin/menu')
			.success(function(data){
				if(data.errno == 0){
					$scope.menus = data.data;
					setMenuTree();
				}else{
					alert(data.message);
				}		
			}).error(function(err){
				alert(err);	
			})
	}
	getCategoryList();
	getMenuList();
	//add category to list

	$scope.addCategoryToList = function(){
		var checked = $("#category_tree").jstree('get_checked');
		var nodes = [];
		//get node		
		checked.forEach(function(v,i){
				var node = _reserves[v];
				nodes.push({
					text : node.name,
					url : '/topics/cat/'+ node.value
				})
		})

		addNodesToMenu(nodes)
	}
	/*
	 * add nodes to menu list
	 * 	 
	 */
	function addNodesToMenu(nodes){
		var ref = $("#menu_tree").jstree(true);
		
		nodes.forEach(function(v,i){
			ref.create_node("#",{text:v.text,a_attr:{"href":v.url,target:"_blank"}},"last",null,false);		
		})
	}

	$scope.save = function(){
		
		var data = $("#menu_tree").jstree(true).get_json('#',{flat:false,no_state:true,no_id:true,no_data:true});
		data = JSON.stringify(data);

		$http.post('/admin/menu',{"_csrf":SecurService.csrf(),q:data})
			.success(function(data){
				if(data.errno == 0){
					alert('save success')
				}else{
					alert('save fail:'+data.message);
				}
			})
			.error(function(err){alert(err)})
	}
}])
