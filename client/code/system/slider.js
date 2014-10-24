function Slider(el,role,config,context) {
	config.cbPrev = this.cbPrev.bind(this);
	config.cbNext = this.cbNext.bind(this);
	jQuery(el).layerSlider(config);
}
Slider.prototype.layout = function() {};
Slider.prototype.destroy = function() {};

Slider.prototype.cbPrev = function(data) {

	setTimeout( this.reflectSlide.bind(this,"prev",data), 100 );

	// curLayer (jQ), curLayerIndex
	// version, prevNext (string)
};
Slider.prototype.cbNext = function(data) {
	// data.nextLayerIndex = 0..
	// data.nextLayer

	setTimeout( this.reflectSlide.bind(this,"next",data), 100 );
};

Slider.prototype.reflectSlide = function(direction,data) {

	var config = Resolver.config(data.nextLayer[0]);
	// console.log(direction, config? config["set-hash"]:"???", data.nextLayer[0], config);

	if (config && config['set-hash']) document.essential.router.setHash(config['set-hash']);
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

