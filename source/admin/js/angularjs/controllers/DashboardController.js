'use strict';

MetronicApp.controller('DashboardController', ['$rootScope', '$scope', '$http', '$timeout',function($rootScope, $scope, $http, $timeouti) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        Metronic.initAjax();
    });
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageBodySolid = true;
    $rootScope.settings.layout.pageSidebarClosed = false;
}]);
