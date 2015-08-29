
exports.index = function (){

	var $ = this.$;
	$.gulp.task('views',['views-preprocess-ejs'],function (){
		console.log('end views task');		
	});
}
