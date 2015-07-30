['../lib/morpheus.js'];

namespace('ui').PushPop = function PushPop(_dom) {
	var _el = null;
	
	function onslideout(e) {
		var el = e.target;
		el.removeEventListener(Morpheus.TRANSITION_END, onslideout, false);
		el.removeTransition(Morpheus.TRANSFORM);
	};
	
	function onslidein(e) {
		var el = e.target;
		el.removeEventListener(Morpheus.TRANSITION_END, onslidein, false);
		el.removeTransition(Morpheus.TRANSFORM);
		
		el.setStyle('left', 0, '%');
		el.translation(0, 0, 0, '%');
	};
	
	function get_slide_in(el, direction) {
		return function() {
			el.addEventListener(Morpheus.TRANSITION_END, onslidein, false);
			el.addTransition(Morpheus.TRANSFORM, 250, 'ease-out', 0);
			
			requestAnimationFrame(function() {
				if (el.className == 'Login')
					console.log('Translating!');
				el.translation(-direction * 100, 0, 0, '%');
			});
		};
	};
	
	var pop_item = function(el, direction) {
		el.addEventListener(Morpheus.TRANSITION_END, onslideout, false);
		el.addTransition(Morpheus.TRANSFORM, 250, 'ease-out', 0);
		
		requestAnimationFrame(function() {
			console.log();
			el.translation(-direction * 100, 0, 0, '%');
		});
	}.bind(this);
	
	var push_item = function(el, direction) {
		el.setStyle('left', direction * 100, '%');
		el.translation(0, 0, 0, '%');
		
		requestAnimationFrame(get_slide_in(el, direction));
	}.bind(this);
	
	this.push = function(item, direction) {
		if (_el)
			pop_item(_el, direction);
		_el = item;
		push_item(item, direction);
	};
};
ui.PushPop.FROM_RIGHT = -1;
ui.PushPop.FROM_LEFT = 1;
