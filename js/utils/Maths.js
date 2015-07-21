namespace('utils').Maths = new (function Maths() {
	var self = this;
	this.get_diff = function(list1, list2, diff) {
		diff = diff || [];
		if (list1.length === 0)
			return diff.concat(list2);
		var pos = list2.indexOf(list1[0]);
		if (pos > -1)
			list2.splice(pos, 1);
		else	
			diff[diff.length] = list1[0];
		return self.get_diff(list1.slice(1), list2, diff);
	};
	this.get_half = function(dist) {
		return Math.floor(dist / 2);
	};
	this.get_offset = function(l1, l2) {
		return self.get_half(l1 - l2);
	};
	this.get_ratio = function(a, b) {
		return a / b;
	};
	this.get_dist = function(a, b) {
		return Math.abs(a - b);
	};
	this.fit_scale = function(ratio1, ratio2, w1, h1, w2, h2) {
		if (ratio2 > ratio1)
			return self.get_ratio(h2, h1);
		return self.get_ratio(w2, w1);
	};
	this.cover_scale = function(w1, h1, w2, h2) {
		if (self.get_ratio(w1, h1) > self.get_ratio(w2, h2))
			return self.get_ratio(h2, h1);
		return self.get_ratio(w2, w1);
	};
	this.get_factor = function(min, max, dist, cutoff) {
		return (max - min) * (1 - (Math.min(dist, cutoff) / cutoff)) + min;
	};
	this.get_next = function(curr, dir, min, max, loop) {
		curr += dir;
		if (curr < min)
			return loop ? max : min;
		if (curr > max)
			return loop ? min : max;
		return curr;
	};
	this.Vector = function Vector(_x, _y, _z) {
		this.x = _x || 0.0;
		this.y = _y || 0.0;
		this.z = _z || 0.0;
	};
	this.Vector.prototype.toString = function() {
		return '[' + [this.x, this.y, this.z].join(',') + ']';
	};
	this.Vector.subtract = function(v1, v2) {
		return new this.Vector(v1.x - v2.x, v1.y - v2.y);
	}.bind(this);
	this.Vector.add = function(v1, v2) {
		return new this.Vector(v1.x + v2.x, v1.y + v2.y);
	}.bind(this);
	this.Tally = function Tally() {
		this.total = 0;
	};
})();
