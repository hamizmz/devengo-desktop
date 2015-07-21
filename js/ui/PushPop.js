['../lib/gems.js'];

namespace('ui').PushPop = function PushPop(_dom) {
	this.on_push = new gems.Channel();
	this.on_pop = new gems.Channel();
};
