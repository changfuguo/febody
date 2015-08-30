
exports.replaceEjs = function () {
		
	var $ = this.$ ,gulp = $.gulp,that = this;
	var folder = this.folder;
	var source  = this.source + "/" + folder.views + '/';
	var dest = this.build + "/" + folder.views + '/';
	var jsonPath = this.build + '/rev/**/*.json';
	gulp.task(folder.views + '-clean-ejs', function (){
		gulp.src([that.build + '/' +  folder.views + '/**/*.ejs'])
			.pipe($.clean({force:true}))
	})
	gulp.task(folder.views + '-preprocess-ejs',[folder.views + '-clean-ejs'],function (){
		gulp.src([ jsonPath , source + '**/*.ejs' ])
			.pipe($.plumber())
			.on('error',$.util.log)
			.pipe($.size({showFiles:that.size}))			
			.pipe($.revCollector())  // replace img
			.pipe(gulp.dest(that.build + '/' +  folder.views + '/'))
	})
}
