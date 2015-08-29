//secure service
MetronicApp.service('SecurService',['$rootScope',function(){
		
	var service = {};

	service.csrf = function(value){
		var dom = angular.element('#_csrf');
		if(value && typeof value =='string' ) {
			dom.val(value);
			return value;
		}

		return dom.val();
	}

	return service ;
}]);
//utility service
MetronicApp.service('UtilityService',['$rootScope',function(){
		
		var service = {};
	
		return service ;
}]);
