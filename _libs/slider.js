!function(window) {

function Slider(el,role,config,context) {
	config.cbPrev = this.cbPrev.bind(this);
	config.cbNext = this.cbNext.bind(this);
	jQuery(el).layerSlider(config);
}
Slider.prototype.layout = function() {};
Slider.prototype.destroy = function() {};

Slider.prototype.cbPrev = function(data) {
	var prev = Resolver.config(data.nextLayer[0]);
	if (prev && prev['set-hash']) {
		location.hash = "#" + prev['set-hash'];
		document.essential.router.hashchange();
	}
	// curLayer (jQ), curLayerIndex
	// version, prevNext (string)
};
Slider.prototype.cbNext = function(data) {
	// data.nextLayerIndex = 0..
	// data.nextLayer
	var next = Resolver.config(data.nextLayer[0]);
	//TODO why is attribute not there???
	if (next && next['set-hash']) {
		location.hash = "#" + next['set-hash'];
		document.essential.router.hashchange();
	}
};

// module: reader export
var slider = {};
if(typeof module === 'object' && typeof module.exports === 'object') {
	slider = module.exports;
}
else {
	window.slider = slider;
}

slider.enhance = function(el,role,config,context) {
    if (window.jQuery == undefined || jQuery.fn.layerSlider == undefined) return false;

    var slider = new Slider(el,role,config,context);
    return slider;
}
slider.Slider = Slider;


}(window);

