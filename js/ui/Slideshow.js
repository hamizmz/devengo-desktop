['../lib/gems.js', '../utils/Maths.js'];

namespace('ui').Slideshow = function Slideshow(_list, _pushpop) {
	var Maths = utils.Maths;
	var _index = 0;
	var _max = _list.length - 1;
	
	this.position = new gems.Channel();
	
	this.next = function() {
		var old = _index;
		var i = _index = Maths.get_next(old, 1, 0, _max, true);
		_pushpop.push(_list[i], 1);
		this.position.broadcast(old, i);
	}.bind(this);
	
	this.prev = function() {
		var old = _index;
		var i = _index = Maths.get_next(old, -1, 0, _max, true);
		_pushpop.push(_list[i], -1);
		this.position.broadcast(old, i);
	}.bind(this);
	
	this.goto = function(index) {
		var old = _index;
		_index = index;
		_pushpop.push(_list[index], 1);
		this.position.broadcast(old, index);
	}.bind(this);
	
	_pushpop.push(_list[0], 1);
};
