['./utils/DOM.js',
'./lib/morpheus.js',
'./ui/Slideshow.js',
'./ui/PushPop.js'];

function __main__() {
	var DOM = utils.DOM;
	
	// UI Junk
	var _pushpop = new ui.PushPop(DOM.slideshow.container);
	var _slideshow = window.slideshow = new ui.Slideshow(DOM.slideshow.slides, _pushpop);
	var _login = DOM.login.container;
	var _register = DOM.register.container;
	
	// Slideshow Nav Stuff
	var _left = DOM.slideshow.nav.left;
	var _right = DOM.slideshow.nav.right;
	var _nav = DOM.slideshow.nav.all;
	// login register boutaaans
	var _loginbtn = DOM.login.button;
	var _registerbtn = DOM.register.button;
	var _cancelbtn = DOM.login.cancel;
	
	function on_shift(old_index, new_index) {
		_nav[old_index + 1].className = '';
		_nav[new_index + 1].className = 'Selected';
	};
	
	function get_clicker(index) {
		return function(e) {
			_slideshow.goto(index);
		};
	};
	
	function push_login(e) {
		_loginbtn.style.display = 'none';
		_registerbtn.style.display = 'none';
		_cancelbtn.style.display = 'inline-block';
		
		_nav[0].parentNode.setStyle('opacity', 0);
		
		_pushpop.push(_login, 1);
	};
	
	function push_register(e) {
		_loginbtn.style.display = 'none';
		_registerbtn.style.display = 'none';
		_cancelbtn.style.display = 'inline-block';
		
		_nav[0].parentNode.setStyle('opacity', 0);
		
		_pushpop.push(_register, 1);
	};
	
	function return_to_slideshow(e) {
		e.target.style.display = 'none';
		_loginbtn.style.display = 'inline-block';
		_registerbtn.style.display = 'inline-block';
		
		_slideshow.goto(0);
		_nav[0].parentNode.setStyle('opacity', 1);
	};
	
	function setup_slideshow_nav() {
		_nav[0].parentNode.addTransition('opacity', 250, 'ease-out', 0);
		_slideshow.position.connect(on_shift);
		
		_left.addEventListener('click', _slideshow.prev, false);
		_right.addEventListener('click', _slideshow.next, false);
		
		for (var i = 1, l = _nav.length - 1; i < l; i++)
			_nav[i].addEventListener('click', get_clicker(i - 1), false);
	};
	
	function setup_user_actions() {
		_loginbtn.addEventListener('click', push_login, false);
		_registerbtn.addEventListener('click', push_register, false);
		_cancelbtn.addEventListener('click', return_to_slideshow, false);
	};
	
	setup_slideshow_nav();
	setup_user_actions();
};
