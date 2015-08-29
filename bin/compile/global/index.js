
exports.index = function (){

	var $ = this.$;
	$.gulp.task('global',['global-compress'],function (){
		console.log('end global task');		
	});

}
