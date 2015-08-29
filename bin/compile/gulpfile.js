/*
 * 1、打包入口，包含globa 、admin、和front三部分
 * 2、加载之前用load-plugins插件加载所有和gulp相关的插件，之后就不在加载,要求写子模块的时候必须以model.exports声明
 * 3、必须先打包global，之后才能打包admin和front
 */

var start = new Date();
var fs = require('fs');
var path = require('path');
var gulp  = require('gulp');
var $ = require('gulp-load-plugins')(
	{
		pattern: ['gulp-*', 'gulp.*'],
		replaceString: /\bgulp[\-.]/,
		scope: "devDependencies",
		config: '../../package.json',
		lazy: false
	});
var globalPath = './global/';
var frontPath = './front/';
var adminPath = './admin/';
var debug = require('../../config/config').debug;
var source = path.resolve(__dirname + '../../../source/');
var build  = path.resolve(__dirname + '../../../build/');
var publish = path.resolve(__dirname + '../../../public/');
var apppath = path.resolve(__dirname + '../../../app/');
var folder = {
	global:	"global",
	admin:	"admin",
	front: "front",
	views: "views"
}

var shelljs = require('shelljs/global')
/*
 * 动态加载js脚本
 *
 */
$.gulp = gulp;
var runSequence = require('run-sequence');
runSequence.use(gulp);
$.runSequence = runSequence;
/*
for(var attr in $){
	if(attr.toLowerCase().indexOf('rev') >=0 ){
		console.log(attr);
	}
}
*/


var app = {$:$,source:source,build:build, folder: folder,debug:debug,size:false};


function loadJs(road) {
	var realPath = path.resolve(road);
	var res = null;
	var toString = Object.prototype.toString;
	fs.readdirSync(realPath).forEach(function (file) {
		if (file.substr(-3) === '.js') {
			res = require(road + '/' + file);
			var type = toString.call(res);
			if (type == '[object Function]') {
				res.call(app);
			} else if(type == '[object Object]'){
				for	(var attr in res) {
					res[attr].call(app);
				}
			}
		}
	})
}

var args = process.argv.slice(2);

var _args = {};

args.forEach(function (v,k){
	var key = v.split('=')[0],value = v.split('=')[1] || 'fv';
	_args[key.replace(/-/g,'')] = value;
		
})
//load js
for (var mod in folder) {
	console.log('start load module : ' + mod);
	loadJs('./' + folder[mod]);
}
gulp.task('noop',function (){
	console.log('empty task');		
})
var model = {} ;
(_args['m'] || '').toLowerCase().split('').forEach(function (v){
	model[v] = true ;
});


gulp.task('copy',function () {
	console.log(build);
	cd(build);
	cp('-Rf','./global',publish);
	cp('-Rf','./admin',publish);
	cp('-Rf','./front',publish);
	cp('-Rf','./views' ,apppath);
})

gulp.task('default',function (callback){
	if (model['g']) {
		runSequence('global',['admin','front'],'views','copy',callback);
	} else if(model['a'] && model['f']) {
		runSequence(['admin','front'],'views','copy',callback);
	} else if(model['a']) {
		runSequence('admin','views','copy',callback);
	} else if (model['f']){
		runSequence('front','views','copy',callback);
	} else if (model['v']) {
		runSequence('views','copy',callback);
	}
})
