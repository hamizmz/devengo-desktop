/*
+-----------------------------------------------------------------------------+

	@grahamzibar presents:

		 _______  _______  _______  _______           _______           _______
		(       )(  ___  )(  ____ )(  ____ )|\     /|(  ____ \|\     /|(  ____ \
		| () () || (   ) || (    )|| (    )|| )   ( || (    \/| )   ( || (    \/
		| || || || |   | || (____)|| (____)|| (___) || (__    | |   | || (_____
		| |(_)| || |   | ||     __)|  _____)|  ___  ||  __)   | |   | |(_____  )
		| |   | || |   | || (\ (   | (      | (   ) || (      | |   | |      ) |
		| )   ( || (___) || ) \ \__| )      | )   ( || (____/\| (___) |/\____) |
		|/     \|(_______)|/   \__/|/       |/     \|(_______/(_______)\_______)


	* version 0.1.0 - ALPHA
	* https://www.github.com/grahamzibar/Morpheus


	* What if I told you... this is not an animation library?

+-----------------------------------------------------------------------------+
*/
(function MorpheusModule(_win) {
	/* Namespacing */
	var Morpheus = _win.Morpheus = new Object();

	/*

		CONSTANTS

	*/
	Morpheus.LINEAR = 'linear';
	Morpheus.EASE = 'ease';
	Morpheus.EASE_IN = 'ease-in';
	Morpheus.EASE_OUT = 'ease-out';
	Morpheus.EASE_IN_OUT = 'ease-in-out';
	Morpheus.EASE_OUT_IN = 'ease-out-in';

	Morpheus.LEFT = 'left';
	Morpheus.RIGHT = 'right';
	Morpheus.CENTER = 'center';

	Morpheus.THREE_D = 'preserve-3d';
	Morpheus.FLAT = 'flat';

	Morpheus.PIXELS = 'px';
	Morpheus.PERCENT = '%';
	Morpheus.RADIANS = 'rad';
	Morpheus.DEGREES = 'deg';

	Morpheus.PREFIX = '';
	Morpheus.TRANSITION_END = 'transitionend';
	Morpheus.TRANSFORM = 'transform';
	Morpheus.FILTER = 'filter';

	/* Setup */
	(function setup(win, morph) {
		if (win.requestAnimationFrame || win.webkitRequestAnimationFrame) {
			morph.PREFIX = '-webkit-';
			morph.TRANSITION_END = 'webkitTransitionEnd';
			morph.TRANSFORM = '-webkit-transform';
			morph.FILTER = '-webkit-filter';
			win.requestAnimationFrame = win.webkitRequestAnimationFrame;
		} else if (win.oRequestAnimationFrame) {
			morph.PREFIX = '-o-';
			morph.TRANSITION_END = 'otransitionend';
			morph.TRANSFORM = '-o-transform';
			morph.FILTER = '-o-filter';
			win.requestAnimationFrame = win.oRequestAnimationFrame;
		} else if (win.mozRequestAnimationFrame) {
			morph.PREFIX = '-moz-';
			morph.TRANSFORM = '-moz-transform';
			morph.FILTER = '-moz-filter';
			win.requestAnimationFrame = win.mozRequestAnimationFrame;
		} else if (win.msRequestAnimationFrame) {
			morph.PREFIX = '-ms-';
			morph.TRANSFORM = '-ms-transform';
			morph.FILTER = '-ms-filter';
			win.requestAnimationFrame = win.msRequestAnimationFrame;
		} else {
			console.error('No polyfill exists yet. Sorry \'bout it.');
			// We need a polyfill fo requestAnimationFrame
			// TODO later.
		}
	})(_win, Morpheus);

	/*

		CLASSES

	*/
	var Vector = function Vector(x, y, z) {
		this.x = x != null ? x : 0.0;
		this.y = y != null ? y : 0.0;
		this.z = z != null ? z : 0.0;
	};
	Vector.prototype.set = function(x, y, z) {
		this.x = x;
		if (y != null) {
			this.y = y;
			if (z != null)
				this.z = z;
		}
	};

	var Collection = function Collection() {
		var _collection = new Array();
		var _cache = {};

		this.collection = _collection;

		function reset_cache(coll) {
			var cache = {}
			for (var i = 0, l = coll.length; i < l; i++)
				cache[coll[i].key] = i;
			return cache;
		};

		function get_index(obj, key) {
			return typeof obj[key] === 'number' ? obj[key] : -1;
		};

		this.add = function(value) {
			var index = _cache[value.key];
			if (typeof index !== 'number')
				index = _cache[value.key] = _collection.length;
			_collection[index] = value;
		};

		this.get = function(key) {
			var i = get_index(_cache, key);
			if (i < 0)
				return null;
			return _collection[i];
		};

		this.remove = function(key) {
			var i = get_index(_cache, key);
			if (i > -1) {
				_collection.splice(i, 1);
				_cache = reset_cache(_collection);
			}
		};
	};

	var Style = function Style(_name, _value, _unit) {
		this.key = _name;
		this.name = _name;
		this.value = _value;
		this.unit = _unit != null ? _unit : '';
	};

	var StyleCollection = function StyleCollection() {
		this.inheritFrom = Collection;
		this.inheritFrom();
		delete this.inheritFrom;
	};

	var Transition = function Transition(_property) {
		this.key = _property;
		this.property = _property;
		this.duration = 500;
		this.delay = 0;
		this.timing = Morpheus.LINEAR;
	};

	var TransitionCollection = function TransitionCollection() {
		this.inheritFrom = Collection;
		this.inheritFrom();
		delete this.inheritFrom;
	};

	var Transform = function Transform() {
		this.translate = new Vector();
		this.translateUnit = 'px';
		this.scale = new Vector(1, 1, 1);
		this.rotate = new Vector();
		this.rotateUnit = 'rad';

		this.origin = new Vector(Morpheus.CENTER, Morpheus.CENTER, Morpheus.CENTER);
		this.style = Morpheus.THREE_D;
	};

	Morpheus.CSSRenderer = function CSSRenderer(_el) {
		var _prefix = Morpheus.PREFIX;

		var onEnterFrame = function(e) {
			var output = '';
			var styles = _el.styles;
			var transitions = _el.transitions;
			var transform = _el.transform;

			if (styles) {
				for (var i = 0, len = styles.collection.length; i < len; i++)
					output += renderStyle(styles.collection[i]);
			}
			var p = _prefix;
			if (transitions)
				output += renderTransitionCollection(transitions, p);
			if (transform)
				output += renderTransform(transform, p);
			setCSS.call(_el, output);
		};

		var renderStyle = function(style) {
			var output = style.name;
			output += ':';
			output += style.value;
			output += style.unit;
			output += ';';
			return output;
		};

		var renderTransitionCollection = function(tc, p) {
			var output = p + 'transition:';
			for (var i = 0, ts = tc.collection, len = ts.length; i < len; i++) {
				if (i)
					output += ', ';
				output += renderTransition(ts[i]);
			}
			output += ';';
			return output;
		};

		var renderTransition = function(transition) {
			var space = ' ';
			var t = transition.property;
			t += space;
			t += transition.duration;
			t += 'ms';
			t += space;
			t += transition.timing;
			t += space;
			t += transition.delay;
			t += 'ms';
			return t;
		};

		var renderTransform = function(transform, p) {
			var space = ' ';
			var t = p + 'transform:translate3d';
			t += renderVector(transform.translate, transform.translateUnit);

			t += space;

			t += 'rotateX(';
			t += transform.rotate.x;
			t += transform.rotateUnit;
			t += ')';
			t += 'rotateY(';
			t += transform.rotate.y;
			t += transform.rotateUnit;
			t += ')';
			t += 'rotateZ(';
			t += transform.rotate.z;
			t += transform.rotateUnit;
			t += ')';

			t += space;

			t += 'scale3d';
			t += renderVector(transform.scale);
			t += ';';

			t += 'transform-origin:';
			t += transform.origin.x;
			t += space;
			t += transform.origin.y;
			t += space;
			t += transform.origin.z;
			t += ';';

			t += 'transform-style:';
			t += transform.style;
			t += ';';

			return t;
		};

		var renderVector = function(vector, unit) {
			unit = unit != null ? unit : '';
			var coord = '(';
			coord += vector.x;
			if (vector.x)
				coord += unit;
			coord += ', ';
			coord += vector.y;
			if (vector.y)
				coord += unit;
			coord += ', ';
			coord += vector.z;
			if (vector.z)
				coord += unit;
			coord += ')';

			return coord;
		};

		this.step = function() {
			requestAnimationFrame(onEnterFrame);
		};

		this.step();
	};

	/*

		FUNCTIONS

	*/
	var getStyle = function(property) {
		if (document.defaultView && document.defaultView.getComputedStyle)
			return document.defaultView.getComputedStyle(this, false).getPropertyValue(property);
		if (this.currentStyle) {
			return this.currentStyle[property.replace(/\-(\w)/g, function (strMatch, p1) {
				return p1.toUpperCase();
			})];
		}
		return null;
	};

	var getStyleNumber = function(property, unit) {
		var value = this.getStyle(property);
		if (unit)
			value = value.split(unit)[0];
		return Number(value);
	};

	var setStyle = function(property, value, unit) {
		if (!this.styles)
			this.styles = new StyleCollection();

		this.styles.add(new Style(property, value, unit));

		if (!this.renderer)
			this.renderer = new Morpheus.CSSRenderer(this);
		this.renderer.step();
	};

	var removeStyle = function(property) {
		if (!this.styles)
			return;

		this.styles.remove(property);

		if (!this.renderer)
			this.renderer = new Morpheus.CSSRenderer(this);
		this.renderer.step();
	};

	var setCSS = function(css) {
		if (typeof this.style.cssText != 'undefined')
			this.style.cssText = css;
		else
			this.setAttribute('style', css);
	};

	var translation = function(x, y, z, unit) {
		if (!this.transform)
			this.transform = new Transform();

		this.transform.translate.x = x;
		this.transform.translate.y = y;
		if (z != null) {
			if (arguments.length === 3 && typeof z !== 'number')
				this.transform.translateUnit = z;
			else
				this.transform.z = z;
		}
		if (unit)
			this.transform.translateUnit = unit;

		if (!this.renderer)
			this.renderer = new Morpheus.CSSRenderer(this);
		this.renderer.step();
	};

	var scale = function(x, y, z) {
		if (!this.transform)
			this.transform = new Transform();

		this.transform.scale.x = x;
		this.transform.scale.y = y;
		if (z != null)
			this.transform.scale.z = z;

		if (!this.renderer)
			this.renderer = new Morpheus.CSSRenderer(this);
		this.renderer.step();
	};

	var rotate = function(x, y, z, unit) {
		if (!this.transform)
			this.transform = new Transform();

		this.transform.rotate.x = x;
		this.transform.rotate.y = y;
		this.transform.rotate.z = z;
		if (unit)
			this.transform.rotateUnit = unit;

		if (!this.renderer)
			this.renderer = new Morpheus.CSSRenderer(this);
		this.renderer.step();
	};

	var setOrigin = function(x, y, z) {
		if (!this.transform)
			this.transform = new Transform();
		this.transform.origin.x = x;
		if (y != null) {
			this.transform.origin.y = y;
			if (z != null)
				this.transform.origin.z = z;
		}
		if (!this.renderer)
			this.renderer = new Morpheus.CSSRenderer(this);
		this.renderer.step();
	};

	var addTransition = function(property, duration, timing, delay) {
		if (!this.transitions)
			this.transitions = new TransitionCollection();

		var transition = this.transitions.get(property);
		if (!transition)
			transition = new Transition(property);

		if (duration)
			transition.duration = duration;
		if (timing)
			transition.timing = timing;
		if (delay)
			transition.delay = delay;

		this.transitions.add(transition);
	};

	var removeTransition = function(property) {
		if (this.transitions)
			this.transitions.remove(property);
	};

	var hasTransition = function(property) {
		return this.transitions && !!this.transitions.get(property);
	};

	/*

		EXTENSION

	*/
	var HTMLElement = _win.HTMLElement;

	HTMLElement.prototype.setCSS = setCSS;
	HTMLElement.prototype.getStyle = getStyle;
	HTMLElement.prototype.getStyleNumber = getStyleNumber;
	HTMLElement.prototype.setStyle = setStyle;
	HTMLElement.prototype.removeStyle = removeStyle;

	HTMLElement.prototype.translation = translation;
	HTMLElement.prototype.scale = scale;
	HTMLElement.prototype.rotate = rotate;
	HTMLElement.prototype.setOrigin = setOrigin;

	HTMLElement.prototype.addTransition = addTransition;
	HTMLElement.prototype.removeTransition = removeTransition;
	HTMLElement.prototype.hasTransition = hasTransition;
})(window);
