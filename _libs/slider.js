!function(window) {

function Slider(el,role,config,context) {
	jQuery(el).layerSlider(config);
}
Slider.prototype.layout = function() {};
Slider.prototype.destroy = function() {};

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

