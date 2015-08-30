/*
 * 1、压缩
 * 2、生成sourcemap
 * 3、生成md5映射文件表
 *
 *
 *
 *
 */

exports.compressJs = function () {

	var $ = this.$ ,gulp = $.gulp,that = this;
	var folder = this.folder;
	var source  = this.source + "/" + folder.global + '/js/';
	var dest = this.build + "/" + folder.global + '/js/';
	gulp.task(folder.global + '-clean-js', function (){
		$.shelljs.rm('-rf',that.build + '/' +  folder.global + '/js/');
	})
	gulp.task(folder.global + '-preprocess-js',[folder.global + '-clean-js'],function (){
		gulp.src([source + '**/*.js' ,'!' + source + '**/*.min.js', '!' + source + '**/{demo,test}/**/*.js'])
			.pipe($.plumber())
			.pipe($.sourcemaps.init())
			.pipe($.uglify())
			.pipe($.rev())
			.pipe($.sourcemaps.write())
			.on('error',$.util.log)
			.pipe($.size({showFiles:that.size}))
			.pipe(gulp.dest(that.build + '/' +  folder.global + '/js/'))
			.pipe($.rev.manifest())
			.pipe(gulp.dest(that.build + '/rev/' + folder.global + '/js' ))
	})
}

/*
 图片的
*/

exports.copyImages = function (){

	var $ = this.$ ,gulp = $.gulp,that = this;
	var folder = this.folder;
	var source  = this.source + "/" + folder.global + '/img/';
	var dest = this.build + "/" + folder.global + '/img/';
	//clear img
	gulp.task(folder.global + '-clean-img',function (){
		$.shelljs.rm('-rf',that.build + '/' +  folder.global + '/img/');
	})
	//
	gulp.task(folder.global + '-copy-img',[folder.global + '-clean-img'],function (){
		gulp.src([source + '**/*'])
			.pipe($.plumber())
			.pipe($.rev())
			.on('error',$.util.log)
			.pipe($.size({showFiles:that.size}))
			.pipe(gulp.dest(that.build + '/' +  folder.global + '/img/'))
			.pipe($.rev.manifest())
			.pipe(gulp.dest(that.build + '/rev/' + folder.global + '/img/' ))
	})
}
/*
	字体
*/

exports.copyFonts = function (){
	var $ = this.$ ,gulp = $.gulp,that = this;
	var folder = this.folder;
	var source  = this.source + "/" + folder.global + '/fonts/';
	var dest = this.build + "/" + folder.global + '/fonts/';
	gulp.task(folder.global + '-clean-fonts',function (){
		$.shelljs.rm('-rf',that.build + '/' +  folder.global + '/fonts/');
	})
	gulp.task(folder.global + '-copy-fonts',[folder.global + '-clean-fonts'],function (){
		gulp.src([source + '**/*'])
		.pipe($.plumber())
		.pipe($.rev())
		.on('error',$.util.log)
		.pipe($.size({showFiles:that.size}))
		.pipe(gulp.dest(that.build + '/' +  folder.global + '/fonts/'))
		.pipe($.rev.manifest())
		.pipe(gulp.dest(that.build + '/rev/' + folder.global + '/fonts/' ))
	})
}


/**
 处理css以及依赖
*/

exports.compressCss = function () {
	var $ = this.$ ,gulp = $.gulp,that = this;
	var folder = this.folder;
	var source  = this.source + "/" + folder.global + '/css/';
	var dest = this.build + "/" + folder.global + '/css/';
	gulp.task(folder.global + '-clean-css',function (){
		$.shelljs.rm('-rf',that.build + '/' +  folder.global + '/css/');
	})

	var jsonPath = this.build + '/rev/' + folder.global + '/**/*.json';
	//["url ('aa.png')", "'", "aa.png"] 
	var regUrl = /url\s*\(\s*(['"]?)([^\(\)]+)\s*\1\)/gi;
	var regSrc = /src\s*=\s*(['"]?)([^'"]+)\1/gi;
	gulp.task(folder.global + '-preprocess-css',[folder.global + '-clean-css' ],function (){
		gulp.src([jsonPath ,source + '**/*.css'])
			.pipe($.plumber())
			.pipe($.rev())
			.on('error',$.util.log)
			.pipe($.revCollector())
			.pipe($.minifyCss())
			.pipe($.size({showFiles:that.size}))
			.pipe(gulp.dest(that.build + '/' +  folder.global + '/css/'))
			.pipe($.rev.manifest())
			.pipe(gulp.dest(that.build + '/rev/' + folder.global + '/css/' ))
	})
}

exports.run = function (){
	var $ = this.$ ,gulp = $.gulp,that = this;
	var folder = this.folder;
	gulp.task(folder.global + '-compress',function (callback) {
		$.runSequence(folder.global + '-copy-img',folder.global + '-copy-fonts',
			folder.global + '-preprocess-js',folder.global + '-preprocess-css',callback);			
	})
}
