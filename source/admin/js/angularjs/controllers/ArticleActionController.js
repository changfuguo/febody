
/* Setup general page controller */
MetronicApp.controller('ArticleActionController', ['$rootScope', '$scope','$state', 'settings','$stateParams','TopicModel','CategoryModel', 'SecurService',
function($rootScope, $scope, $state,settings,$stateParams,Topic,Category,SecurService) {
    $scope.$on('$viewContentLoaded', function() {   
    	// initialize core components
    	Metronic.initAjax();

    	// set default layout mode
        $rootScope.settings.layout.pageBodySolid = true;
        $rootScope.settings.layout.pageSidebarClosed = true;

		$scope.action = $stateParams.action ;
		$scope.form_title = $scope.action == "update"?"更新文章":"新增文章";


		var action = $stateParams.action;
		var id = $stateParams.id ;
		$scope.editorOptions = {
			lineNumbers: true ,
			toolbarContainer: '.btn-toolbar'
		};

		//categories 

		$scope.categories = []; 
		$scope.topic = new Topic();
		$scope.topic.good = 0 ;
		$scope.topic.top = 0 ;
		Category.getList('article')
			.then(function(list){
				list.reverse().forEach(function(v,i){
					$scope.categories.push({
						value : v._id,
						name  : new Array(v.path.length + 1).join('&nbsp;&nbsp;') + v.name
					})		
				})		
			});
		//save to db 
		
		if(action == "update"){
			$scope.topic._id = id ;
			$scope.topic.get()
				.then(function(data){
					if(!data){
						alert('data is lost ');
						$state.go('article_list');
						return false ;
					}
					angular.extend($scope.topic,data);		
				},function(err){
						alert(err);
				})
		
		}
		$scope.save = function (status){
			$scope.topic.status = status ;
		    $scope.topic._csrf = SecurService.csrf();	
			if(action =='add' && !id ){
				$scope.topic.create()
					.then(function(data){
						alert('save success');
						$state.go('article_action',{action : "update",id:data._id})
					},function(err){
						alert(err);
					})
			}else if(action == 'update' && id){
				$scope.topic.update()
					.then(function(data){
						alert('save success');
						//$state.go('article_action',{action : "update",id:data._id})
					},function(err){
						alert(err);
					})

			
			}
		}
    });
}]);
