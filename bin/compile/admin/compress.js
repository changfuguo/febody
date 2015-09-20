/*
 * 1、压缩
 * 2、生成sourcemap
 * 3、生成md5映射文件表
 */

exports.compressJs = function () {

	var $ = this.$ ,gulp = $.gulp,that = this;
	var folder = this.folder;
	var source  = this.source + "/" + folder.admin + '/js/';
	var dest = this.build + "/" + folder.admin + '/js/';
	// first clean

	gulp.task(folder.admin + '-clean-js',function (){
		$.shelljs.rm('-rf',that.build + '/' +  folder.admin + '/js/');
	})
	gulp.task(folder.admin + '-preprocess-js',[folder.admin + '-clean-js'],function (){
		gulp.src([source + '**/*.js' , '!' + source + '**/*/app.js'])
			.pipe($.plumber())
			.pipe($.sourcemaps.init())
			.pipe($.if(!that.debug, $.uglify()))
			.pipe($.rev())
			.pipe($.sourcemaps.write())
			.on('error',$.util.log)
			.pipe($.size({showFiles:that.size}))
			.pipe(gulp.dest(that.build + '/' +  folder.admin + '/js/'))
			.pipe($.rev.manifest())
			.pipe(gulp.dest(that.build + '/rev/' + folder.admin + '/js' ))
	})
}

/*
 图片的
*/

exports.copyImages = function (){

	var $ = this.$ ,gulp = $.gulp,that = this;
	var folder = this.folder;
	var source  = this.source + "/" + folder.admin + '/img/';
	var dest = this.build + "/" + folder.admin + '/img/';
	gulp.task(folder.admin + '-clean-img',function (){
		$.shelljs.rm('-rf',that.build + '/' +  folder.admin + '/img/');
	})

	gulp.task(folder.admin + '-copy-img',[folder.admin + '-clean-img'],function (){
		gulp.src([source + '**/*'])
			.pipe($.plumber())
			.pipe($.rev())
			.on('error',$.util.log)
			.pipe($.size({showFiles:that.size}))
			.pipe(gulp.dest(that.build + '/' +  folder.admin + '/img/'))
			.pipe($.rev.manifest())
			.pipe(gulp.dest(that.build + '/rev/' + folder.admin + '/img/' ))
	})
}
/*
	字体
*/

exports.copyFonts = function (){
	var $ = this.$ ,gulp = $.gulp,that = this;
	var folder = this.folder;
	var source  = this.source + "/" + folder.admin + '/fonts/';
	var dest = this.build + "/" + folder.admin + '/fonts/';
	gulp.task(folder.admin + '-clean-fonts',function (){
		$.shelljs.rm('-rf',that.build + '/' +  folder.admin + '/fonts/');
	})
	gulp.task(folder.admin + '-copy-fonts',[folder.admin + '-clean-fonts'],function (){
		gulp.src([source + '**/*'])
			.pipe($.plumber())
			.pipe($.rev())
			.on('error',$.util.log)
			.pipe($.size({showFiles:that.size}))
			.pipe(gulp.dest(that.build + '/' +  folder.admin + '/fonts/'))
			.pipe($.rev.manifest())
			.pipe(gulp.dest(that.build + '/rev/' + folder.admin + '/fonts/' ))
	})
}


/**
 处理css以及依赖
*/

exports.compressCss = function () {
	var $ = this.$ ,gulp = $.gulp,that = this;
	var folder = this.folder;
	var source  = this.source + "/" + folder.admin + '/css/';
	var dest = this.build + "/" + folder.admin + '/css/';
	gulp.task(folder.admin + '-clean-css',function (){
		$.shelljs.rm('-rf',that.build + '/' +  folder.admin + '/css/');
	})

	var jsonPath = this.build + '/rev/**/*.json';
	gulp.task(folder.admin + '-preprocess-css',function (){
		//gulp.src([jsonPath ,source + '**/*.css'])
		gulp.src([jsonPath ,source + '/**/*.css'])
			.pipe($.plumber())
			.pipe($.rev())
			.on('error',$.util.log)
			.pipe($.revCollector())  // replace img
			.pipe($.minifyCss())
			.pipe($.size({showFiles:that.size}))
			.pipe(gulp.dest(that.build + '/' +  folder.admin + '/css/'))
			.pipe($.rev.manifest())
			.pipe(gulp.dest(that.build + '/rev/' + folder.admin + '/css/' ))
	})
}

/*
最后要处理 app.js ,这里处理只是替换之前生成的东西

*/

exports.processApp = function (){
	var $ = this.$ ,gulp = $.gulp,that = this;
	var folder = this.folder;
	var source  = this.source + "/" + folder.admin + '/js/';
	var dest = this.build + "/" + folder.admin + '/js/';
	var jsonPath = this.build + '/rev/**/*.json';
	gulp.task(folder.admin + '-clean-app',function () {
		$.shelljs.rm('-rf',that.build + '/admin/js/angularjs/app*.js');
	})
	gulp.task(folder.admin + '-app',[folder.admin + '-clean-app'],function () {
		gulp.src([jsonPath,that.source + '/admin/js/angularjs/app.js'])
			.pipe($.plumber())
			.pipe($.revCollector())
			.pipe($.ignore.exclude('./**/*.json'))
			.pipe($.rev())
			.pipe($.size({showFiles:that.size}))
			.pipe(gulp.dest( that.build + '/admin/js/angularjs/'))
			.pipe($.rev.manifest())
			.pipe(gulp.dest(that.build + '/rev/' + folder.admin + '/js/app'))
	})
}


exports.run = function () {
	var $ = this.$ ,gulp = $.gulp,that = this;
	var folder = this.folder;
	var source  = this.source + "/" + folder.admin + '/css/';
	var dest = this.build + "/" + folder.admin + '/css/';
	gulp.task(folder.admin + '-compress',function (callback){
		$.runSequence([folder.admin + '-copy-img',folder.admin + '-copy-fonts'],
			[folder.admin + '-preprocess-css'],
			[folder.admin + '-preprocess-js']
			,callback);			
	})
}
