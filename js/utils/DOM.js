namespace('utils').DOM = (function dom(_doc) {
	var get_item = function(id) {
		return this.getElementById(id);
	}.bind(_doc);
	
	function get_nav(nav) {
		return {
			container: nav,
			left: get_item('slideshow_left'),
			all: nav.getElementsByTagName('li'),
			right: get_item('slideshow_right')
		};
	};
	
	function get_slideshow() {
		var container = get_item('slideshow');
		return {
			container: container,
			nav: get_nav(container.getElementsByTagName('nav')[0]),
			slides: container.getElementsByClassName('Slide')
		};
	};
	
	function get_login(cancel) {
		return {
			container: get_item('login'),
			button: get_item('login_btn'),
			cancel: cancel
		};
	};
	
	function get_register(cancel) {
		return {
			container: get_item('register'),
			button: get_item('register_btn'),
			cancel: cancel
		};
	};
	
	function get_all() {
		var cancel = get_item('cancel_btn');
		return {
			slideshow: get_slideshow(),
			login: get_login(cancel),
			register: get_register(cancel)
		};
	};
	
	return get_all();
})(window.document);
