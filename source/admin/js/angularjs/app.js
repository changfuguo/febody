/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router", 
    "ui.bootstrap", 
    "oc.lazyLoad",  
    "ngSanitize",
	"ncy-angular-breadcrumb",
	"ui-codemirror-markdown"
],function($httpProvider){
  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	console.log($httpProvider.defaults);
  /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */ 
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
      
    for(name in obj) {
      value = obj[name];
        
      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }
      
    return query.length ? query.substr(0, query.length - 1) : query;
  };

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];

}) 

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

/********************************************
 BEGIN: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/
/**
`$controller` will no longer look for controllers on `window`.
The old behavior of looking on `window` for controllers was originally intended
for use in examples, demos, and toy apps. We found that allowing global controller
functions encouraged poor practices, so we resolved to disable this behavior by
default.

To migrate, register your controllers with modules rather than exposing them
as globals:

Before:

```javascript
function MyController() {
  // ...
}
```

After:

```javascript
angular.module('myApp', []).controller('MyController', [function() {
  // ...
}]);

Although it's not recommended, you can re-enable the old behavior like this:

```javascript
angular.module('myModule').config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);
**/

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  //console.log('controllerProvider',$controllerProvider)
  $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: true, // sidebar menu state
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: '/admin/layout/img/',
        layoutCssPath: '/admin/layout/css/'
    };
    $rootScope.settings = settings;
    return settings;
}]);
/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
        //console.log('view loader')
        //Metronic.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });

    //检测locationChange ，填充当前的面包片
    $scope.$on('$locationChangeStart',function(){
        console.log(arguments)
    })
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', function($scope) {
    //$scope.$on('$includeContentLoaded', function() {
        console.log('includeContentLoaded')
        Layout.initHeader(); // init header
    //});
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope', function($scope) {
    //$scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar(); // init sidebar
    //});
}]);

/* Setup Layout Part - Quick Sidebar */
MetronicApp.controller('QuickSidebarController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
        setTimeout(function(){
            QuickSidebar.init(); // init quick sidebar        
        }, 2000)
    });
}]);

/* Setup Layout Part - Theme Panel */
MetronicApp.controller('ThemePanelController', ['$scope', function($scope) {    
    //$scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    //});
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
    //$scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    //});
}]);

/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/home");  
    // $urlRouterProvider.otherwise("/test.html");  
     //console.log('test for stateProvider ')
    $stateProvider

        // Dashboard
        .state('home', {
            url: "/home",
            templateUrl: "/admin/gettemplate!pages/dashboard.html",      
            data: {pageTitle: '罗盘'},
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
							'/admin/js/angularjs/controllers/DashboardController.js'

                        ] 
                    });
                }]
            },
			ncyBreadcrumb:{
				label:"主页"
			}
        })
		.state('settings',{
			url:"/settings/global",
			templateUrl: "/admin/gettemplate!pages/settings.html",
            data: {pageTitle: '全局设置'},
            controller: "SettingsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
							'/admin/js/angularjs/controllers/SettingsController.js'
                        ] 
                    }]);
                }] 
            },ncyBreadcrumb:{
				label :"设置"
			}
		})

		.state('settings_global',{
			url:"/settings/global",
			templateUrl: "/admin/gettemplate!pages/settings.html",
            data: {pageTitle: '分类设置'},
            controller: "SettingsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
							'/admin/js/angularjs/controllers/SettingsController.js'
						] 
                    }]);
                }] 
            },ncyBreadcrumb:{
				label :"全局设置"
			}
		})
        // Tree View
        .state('settings_category', {
            url: "/settings/category",
            templateUrl: "/admin/gettemplate!pages/category_manage.html",
            data: {pageTitle: '分类设置'},
            controller: "CategoryManageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
							'/global/css/jstree/dist/themes/default/style.css',
							'/global/js/plugins/jstree/dist/jstree.js',
							'/admin/js/angularjs/controllers/CategoryManageController.js',
							'/admin/js/angularjs/models/CategoryModel.js'
                        ] 
                    }]);
                }] 
            },ncyBreadcrumb:{
				label:"分类设置",
				parent:"settings"	
			}
        })     

       //导航设置
        .state('settings_navigator', {
            url: "/settings/navigator",
            templateUrl: "/admin/gettemplate!pages/navigator.html",
            data: {pageTitle: '导航设置'},
            controller: "NavigatorController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'MetronicApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
							'/global/css/jstree/dist/themes/default/style.css',
							'/admin/css/layout/angular-ui-tree.min.css',
							'/global/js/plugins/jstree/dist/jstree.js',
							'/admin/js/angularjs/angular-ui-tree.js',
							'/admin/js/angularjs/models/CategoryModel.js',
							'/admin/js/angularjs/controllers/NavigatorController.js'
                        ]                    
                    });
                }]
            }
			,ncyBreadcrumb:{
				label:"导航设置",
				parent:"settings"
			}
        })

		//文章管理
		.state('article',{
			url:"/article",
			templateUrl: "/admin/gettemplate!pages/article_list.html",
            data: {pageTitle: '文章列表'},
            controller: "ArticleListController",
            resolve: {
                 deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
							'/admin/js/angularjs/models/TopicModel.js',
							'/admin/js/angularjs/models/CategoryModel.js'
                        ] 
                    },{
						name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
							'/admin/js/angularjs/controllers/ArticleListController.js'
                        ] 
					}]);
                }] 
			},ncyBreadcrumb:{
				label :"文章管理"
			}
		})
		.state('article_list',{
			url:"/article/list",
			templateUrl: "/admin/gettemplate!pages/article_list.html",
            data: {pageTitle: '文章列表'},
            controller: "ArticleListController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
							'/admin/js/angularjs/models/TopicModel.js',
							'/admin/js/angularjs/models/CategoryModel.js'
                        ] 
                    },{
						name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
							'/admin/js/angularjs/controllers/ArticleListController.js'
                        ] 
					}]);
                }] 
            },ncyBreadcrumb:{
				label :"文章列表",
				parent:"article"
			}
		})
		.state('article_action',{
			url:"/article/{action:update|add}/{id}?",
			templateUrl: "/admin/gettemplate!pages/article_action.html",
            data: {pageTitle: '文章列表'},
            controller: "ArticleActionController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
							'/global/css/codemirror/lib/codemirror.css',
							'/global/css/highlight/styles/monokai.css',
							'/admin/js/angularjs/models/TopicModel.js',
							'/admin/js/angularjs/models/CategoryModel.js'
                        ] 
                    },{
						name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
							'/admin/js/angularjs/controllers/ArticleActionController.js',
							'/global/js/marked/marked.js',
							'/global/js/codemirror/lib/codemirror.js',
							'/global/js/codemirror/addon/edit/continuelist.js',
							'/global/js/codemirror/addon/mode/overlay.js',
							'/global/js/codemirror/mode/xml/xml.js',
							'/global/js/codemirror/mode/markdown/markdown.js',
							'/global/js/codemirror/mode/gfm/gfm.js',
							'/global/js/highlight/js/highlight.js',
							'/admin/js/angularjs/ui-codemirror-markdown-editor.js'
                        ] 
					}]);
                }] 
            },ncyBreadcrumb:{
				label :"{{form_title}}",
				parent:"article"
			}
		})
}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view

    //console.log('test for run ')
    angular.element('body').removeClass('page-on-load');
}]);
