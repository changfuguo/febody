
exports.index = function (){

	var $ = this.$;
	$.gulp.task('front',['front-compress'],function (){
		console.log('end front task');		
	});

}
