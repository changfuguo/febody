
exports.index = function (){

	var $ = this.$;
	$.gulp.task('admin',['admin-compress'],function (){
		$.runSequence('admin-app')
	});

}
