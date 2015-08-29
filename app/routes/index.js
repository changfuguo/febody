/*
* index routes 
* author:changfuguo
* date  :2015-01-27
*
*/


var cIndex = require('../controller/index'),
	tplHelper = require('../../components/template');
module.exports = function(app){

    //app.get 
    app.get('/', cIndex.index);
}
