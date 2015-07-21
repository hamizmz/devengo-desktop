namespace('utils').DOM = (function dom(_doc) {
	var get_item = function(id) {
		return this.getElementById(id);
	}.bind(_doc);
	
	function get_all(get_item) {
		return {  };
	};
	
	return get_all(get_item);
})(window.document);
