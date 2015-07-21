(function() {
	function namespace(names) {
		if (!names.length)
			return this;
		var space = this[names[0]] = this[names[0]] || {};
		return namespace.call(space, names.slice(1));
	};

	window.namespace = function(namesSTR) {
		return namespace(namesSTR.split('.'));
	};
})();
