
/* Setup general page controller */
MetronicApp.controller('ArticleListController', ['$rootScope', '$scope', 'settings','TopicModel','CategoryModel','SecurService', 
function($rootScope, $scope, settings,Topic,Category,SecurService) {
    $scope.$on('$viewContentLoaded', function() {   
    	// initialize core components
    	Metronic.initAjax();

    	// set default layout mode
        $rootScope.settings.layout.pageBodySolid = true;
        $rootScope.settings.layout.pageSidebarClosed = true;
    });

	$scope.categories = [];
	var orginCategories= [];
	Category.getList('article')
			.then(function(list){
				orginCategories = list ;
				list.reverse().forEach(function(v,i){
					$scope.categories.push({
						value : v._id,
						name  : new Array(v.path.length + 1).join('&nbsp;&nbsp;') + v.name
					})		
				})		
			});

	//condition
	$scope.start_open = false;
	$scope.end_open = false;
	$scope.format = "yyyy-MM-dd";
	$scope.dateOptions = {
		startingDay :1 	
	};
	
	$scope.transfer = function(v){ return v^1};
	$scope.open = function($event,mode){
		$event.preventDefault();
		$event.stopPropagation();

		$scope[mode] = true ;
	}

	$scope.setStatus = function(status){
		return Topic.status[status] || '未知..xx';	
	}
	$scope.setCategory = function(id){
		var len = orginCategories.length, item = null;
		if(id.replace(/0/g,'') == '')return '未分类';
		for(var i = 0; i< len; i++){
			item = orginCategories[i];
			if(item._id == id)
				return item.name; 
		}

		return '未知分类';
	}
	var con = $scope.condition = {};
	con.status = 1 ;
	con.top = 0 ;
	con.good = 0;
	con.pageSize = 10 ;
	con.currentPage = 1 ;
	con._csrf = SecurService.csrf();
	//search by condition filter
    $scope.search = function(){
			
		Topic.getList(con)
			
			.then(function(data){
				$scope.topics = data.listInfo;	
			})
	}	

}]);
