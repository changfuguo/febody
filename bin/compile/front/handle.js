
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
	var source  = this.source + "/" + folder.front + '/js/';
	var dest = this.build + "/" + folder.front + '/js/';
	// first clean

	gulp.task(folder.front + '-clean-js',function (){
		$.shelljs.rm('-rf',that.build + '/' +  folder.front + '/js/');
	})
	gulp.task(folder.front + '-preprocess-js',[folder.front + '-clean-js'],function (){
		gulp.src([source + '**/*.js' ])
			.pipe($.plumber())
			.pipe($.if(!that.debug, $.uglify()))
			.pipe($.rev())
			.on('error',$.util.log)
			.pipe($.size({showFiles:that.size}))
			.pipe(gulp.dest(that.build + '/' +  folder.front + '/js/'))
			.pipe($.rev.manifest())
			.pipe(gulp.dest(that.build + '/rev/' + folder.front + '/js/' ))
	})
}

/*
 图片的
*/

exports.copyImages = function (){

	var $ = this.$ ,gulp = $.gulp,that = this;
	var folder = this.folder;
	var source  = this.source + "/" + folder.front + '/img/';
	var dest = this.build + "/" + folder.front + '/img/';
	gulp.task(folder.front + '-clean-img',function (){
		$.shelljs.rm('-rf',that.build + '/' +  folder.front + '/img/');
	})

	gulp.task(folder.front + '-copy-img',[folder.front + '-clean-img'],function (){
		gulp.src([source + '**/*'])
			.pipe($.plumber())
			.pipe($.rev())
			.on('error',$.util.log)
			.pipe($.size({showFiles:that.size}))
			.pipe(gulp.dest(that.build + '/' +  folder.front + '/img/'))
			.pipe($.rev.manifest())
			.pipe(gulp.dest(that.build + '/rev/' + folder.front + '/img/' ))
	})
}
/*
	字体
*/

exports.copyFonts = function (){
	var $ = this.$ ,gulp = $.gulp,that = this;
	var folder = this.folder;
	var source  = this.source + "/" + folder.front + '/fonts/';
	var dest = this.build + "/" + folder.front + '/fonts/';
	gulp.task(folder.front + '-clean-fonts',function (){
		$.shelljs.rm('-rf',that.build + '/' +  folder.front + '/fonts/');
	})
	gulp.task(folder.front + '-copy-fonts',[folder.front + '-clean-fonts'],function (){
		gulp.src([source + '**/*'])
			.pipe($.plumber())
			.pipe($.rev())
			.on('error',$.util.log)
			.pipe($.size({showFiles:that.size}))
			.pipe(gulp.dest(that.build + '/' +  folder.front + '/fonts/'))
			.pipe($.rev.manifest())
			.pipe(gulp.dest(that.build + '/rev/' + folder.front + '/fonts/' ))
	})
}


/**
 处理css以及依赖
*/

exports.compressCss = function () {
	var $ = this.$ ,gulp = $.gulp,that = this;
	var folder = this.folder;
	var source  = this.source + "/" + folder.front + '/css/';
	var dest = this.build + "/" + folder.front + '/css/';
	gulp.task(folder.front + '-clean-css',function (){
		$.shelljs.rm('-rf',that.build + '/' +  folder.front + '/css/');
	})

	var jsonPath = this.build + '/rev/**/*.json';
	gulp.task(folder.front + '-preprocess-css',function (){
		gulp.src([jsonPath ,source + '/**/*.css'])
			.pipe($.plumber())
			.pipe($.rev())
			.on('error',$.util.log)
			.pipe($.revCollector())  // replace img
			.pipe($.minifyCss())
			.pipe($.size({showFiles:that.size}))
			.pipe(gulp.dest(that.build + '/' +  folder.front + '/css/'))
			.pipe($.rev.manifest())
			.pipe(gulp.dest(that.build + '/rev/' + folder.front + '/css/' ))
	})
}
exports.run = function () {
	var $ = this.$ ,gulp = $.gulp,that = this;
	var folder = this.folder;
	var source  = this.source + "/" + folder.front + '/css/';
	var dest = this.build + "/" + folder.front + '/css/';
	gulp.task(folder.front + '-compress',function(callback){
		$.runSequence([folder.front + '-copy-img',folder.front + '-copy-fonts'],
			[folder.front + '-preprocess-css'],
			[folder.front + '-preprocess-js'],
			callback);
	})
}
