
/* Setup general page controller */
MetronicApp.controller('CommentsListController', ['$rootScope', '$scope','$stateParams', 'settings','SecurService',"CommentModel", 
function($rootScope, $scope,$stateParams, settings,SecurService,Comment) {
    $scope.$on('$viewContentLoaded', function() {   
    	// initialize core components
    	Metronic.initAjax();

    	// set default layout mode
        $rootScope.settings.layout.pageBodySolid = true;
        $rootScope.settings.layout.pageSidebarClosed = true;
    });
	console.log('load con success')
	var id = $stateParams.id;
	$scope.comments = [];
	$scope.setStatus = function (status) {
	
		return Comment.status[status];
	}	
	$scope.format = function (t) {
		return moment(t).format('YY-MM-DD HH:mm:ss a')
	};
	Comment.getList({id:id,"_csrf":SecurService.csrf()})
		.then(function (list) {
			$scope.comments = list;
	})
	
	$scope.del = function (t) {
		var comment = new Comment();
		comment._id = t._id;
		comment._csrf = SecurService.csrf();

		comment.del()
			.then(function (id){
				t.status = -1;
			},function (msg){
				alert(msg);
			})
	}

	$scope.publish = function (t) {
		var comment = new Comment();
		comment._id = t._id;
		comment._csrf = SecurService.csrf();
		comment.publish()
			.then(function (id){
				t.status = 1;
			},function (msg){
				alert(msg);
			})

	}
}]);
