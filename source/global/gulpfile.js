var gulp = require('gulp');

var source = './js/';
var less = require('gulp-less');
var rename = require("gulp-rename");

var replace = require('gulp-replace');
var webpack = require('gulp-webpack');
var rev = require('gulp-rev');
var revcollector = require('gulp-rev-collector');
var fixpath = require('gulp-anycontent');

gulp.task('copy-css',function (){
	return gulp.src([source + '**/*.{less,css}','!'+source+'**/*.min.css','!' + source + '**/demo/*.css'])
			/*.pipe(replace(/url\s*\((['"]?)([^)]+)\1\s*\)/g,function (match,sep,url){
				if(url.indexOf("data:image") ==0 ){
					return url;
				} else if(url.indexOf('/global/js/plugins/') == 0){
					return url.replace('/global/js/plugins/','../img/');
				} else {
					return url ;
				}
			}))*/
			.pipe(fixpath(function (contents,path){
				contents = contents || '';
				contents = contents.replace(/url\s*\((['"]?)([^)]+)\1\s*\)/g,function (match,sep,url){
					if(url.indexOf("data:image") ==0 ){
						return ' url(' + url +') ';
					} else if(url.indexOf('..') == 0){
					
						var paths = path.split('/js/')[1].split('/'), pl = paths.length;
						paths.pop();

						while(url.substr(0,3) == '../'){
							url = url.substr(3);
							paths.pop();
						}
						url = paths.length > 0 ? paths.join('/')+ '/' + url :  url;
						url = new Array(pl + 1).join('../') + 'img/' + url
						return ' url(' + url +') ';
					} else {
						var paths = path.split('/js/')[1].split('/'),pl = paths.length;
						paths.pop();
						
						console.log('old url:' + url)
						console.log('path: ' + path);
						
						if(url.indexOf('./') == 0) {
							url = url.substr(2);
						}
						if(url.indexOf('/') == 0) {
							url = url.substr(1);
						}
						url = paths.length > 0 ? paths.join('/')+ '/' + url :  url;
						url = new Array(pl + 1).join('../') + 'img/' + url;
						console.log('new url:' + url);
						
						return ' url(' + url +') ';
					}
				});

				return contents;
			}))
			.pipe(gulp.dest('./css/'))
})


gulp.task('copy-images',function (){
	return gulp.src([source + '**/*.{jpg,jpeg,gif,png}'])
			.pipe(gulp.dest('./img/'))
})
gulp.task('copy-fonts',function (){
	return gulp.src([source + '**/*.{woff,woff2,svg}'])
			.pipe(rename(function(path){
				path.dirname = path.dirname.split('/')[0];
			}))
			.pipe(gulp.dest('./fonts/'))
})

gulp.task('less',function (){
	return gulp.src('./css/**/bootstrap-markdown.less')
				.pipe(less())
				.pipe(gulp.dest('./css'))

})

gulp.task('default',function (){

	gulp.run(['copy-css','copy-images','copy-fonts']);
})
