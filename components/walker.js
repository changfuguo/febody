/*
 * 将平行结构的数据按照父子关系合并成属性结构
 *
 */

var Walker = function (opts){

	this.parent_key = opts.parent_key || 'parent_id';
	this.main_key = opts.main_key || 'id';
	this.default_value = opts.default_value || '';
	this.children_key = opts.children_key || 'children';
}



Walker.prototype.process = function (list, keep) {

	var map = {}, items= [];
	var len = list.length;
	var that = this;
	var item = null;
	for(var i = 0; i < len; i++) {
		item = list[i], id = item[this.main_key];
		map[id]  = list[i];
	}
	item = null;
	for(i = 0 ; i < len; i++) {
		item = list[i];
		if ( item[this.parent_key] && map[item[this.parent_key]]) {
			!map[item[this.parent_key]][this.children_key] && (map[item[this.parent_key]][this.children_key] =[]);
			map[item[this.parent_key]][this.children_key].push(item);
		} else {
			items.push(item);
		}
	}
	return items;
}

exports.Walker = Walker;
