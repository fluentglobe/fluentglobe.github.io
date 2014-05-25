!function() {
	var Layouter = Resolver("essential::Layouter::"),
		addEventListeners = Resolver("essential::addEventListeners::"),
		MutableEvent = Resolver("essential::MutableEvent::"),
		EnhancedDescriptor = Resolver("essential::EnhancedDescriptor::"),
		Placement = Resolver("essential::ElementPlacement::"),
		HTMLElement = Resolver("essential::HTMLElement::");

	var	geoip = Resolver("document::essential.geoip");
		geoip.declare({});
		geoip.stored("load change","session")

	//TODO configurable delayed value, list of required entries

	//TODO resolve before checking, if undefined
	function  _getGeoIP() {
		Resolver("state").set("state.configured",false);
		var xhr = Resolver("essential::XMLHttpRequest::")();
		xhr.open("GET",'http://freegeoip.net/json/',true);
		// xhr.setRequestHeader('Accept','text/json')
		try {
		/*
		$.get('http://freegeoip.net/json/',function(data) {

			geoip.set(data);
		}, 'jsonp');
		*/
			xhr.send(null);
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					Resolver("state").set("state.configured",true);
					if (xhr.status >= 200 && xhr.status < 300) {
						geoip.set(JSON.parse(xhr.responseText));
					} else {
						geoip.set("errorStatus",xhr.status);
						geoip.set("error",xhr.responseText);
					}
				}
			}
		}
		catch(ex) {

		}
	}

	Layouter.variant("intro-plus-article",Generator(function(key,el,conf,parent,context) {

		this.lowBoundsWidth = conf.lowBoundsWidth || 800;
		this.afterContent = conf.afterContent || 60;
		// this.placeParts(el);
		this.tracer = HTMLElement("div",{"class":"bg-tracer", "append to":el});

		this.article = el.querySelector("article");
		this.intro = el.querySelector("#intro");
		this.introFooter = el.querySelector("#intro > footer");

		// if (this.intro) {
		// 	this.introPlacement = new Placement(this.intro);
		// 	this.introPlacement.manually(['paddingTop','paddingBottom']);

		// 	this.paddingVert = parseInt(this.introPlacement.style.paddingTop) + parseInt(this.introPlacement.style.paddingBottom);
		// }

	},Layouter,{ 
		prototype: {

			"layout": function(el,layout,sizingEls) {
				//TODO add tracer element instead of having it in frontpage.html

				//TODO configurable after content gap
				var contentHeight = this.introFooter? this.introFooter.offsetTop + this.introFooter.offsetHeight : layout.height,
					bgWidth = this.tracer? this.tracer.offsetWidth : layout.width, bgHeight = this.tracer? this.tracer.offsetHeight : layout.height,
					effectiveBgHeight = Math.floor( bgHeight * layout.width/bgWidth ),
					fixedIntro = !(layout.width <= this.lowBoundsWidth);

				var introHeight = layout.height;
		        var maxHeight = fixedIntro? Math.min(effectiveBgHeight, layout.height, contentHeight + this.afterContent) : (contentHeight + this.afterContent);

				if (this.intro) {
		            this.intro.style.maxHeight = maxHeight + "px";
		            // Since maxheight doesn't seem to be applied immediately, do it in code
					introHeight = Math.min(this.intro.offsetHeight,maxHeight);
				}
		        // console.log(effectiveBgHeight,fixedIntro,introHeight,maxHeight);

				if (this.article) {
		            if (!fixedIntro || bgHeight == 0) this.article.style.top = "0";
		            else if (contentHeight) this.article.style.top = introHeight+"px";
				}

			}
		}
	}));


	Resolver("document::readyState").on("change",function(ev) {

		if (ev.value == "interactive" && geoip().ip == undefined) {
			_getGeoIP();
		}

		//TODO move to lib
		if (ev.value == "complete" || ev.value == "interactive") {
			var body = Resolver("essential::DescriptorQuery::")(document.body);
			body[0].conf.sizingElement = true;
			body.enhance();
		}
	});



	function Navigation(el,config) {
	    this.stateful = el.stateful;

	    addEventListeners(el, {
	        // "change": form_input_change,
	        "click": dialog_button_click
	    },false);

	    var config, items = el.querySelectorAll("[role=menuitem]");
	    for(var i=0,item; item = items[i]; ++i) {
	        config = Resolver.config(item);
	        if (config.select) {
	            this.stateful.on("change",config.select,{config:config,el:item},
	                function(ev) {
	                    if (ev.value == ev.data.config.value) {
	                        ev.data.el.stateful.set("state.selected",true);
	                    } else {
	                        ev.data.el.stateful.set("state.selected",false);
	                    }
	                });
	            if (item.stateful(config.select,"false") == config.value) item.stateful.set("state.selected",true);
	        }        
	    }
	}

	Navigation.prototype.destroy = function() {

	};

	Navigation.prototype.click = function(ev) {

	    if (ev.commandRole == "menuitem") {
	        var config = Resolver.config(ev.commandElement);
	        if (config.select) {
	            this.stateful.set(config.select,config.value);
	        }
	        
	        // model.language
	        // ev.commandElement.stateful.set("state.selected",true);
	    }
	};

	function dialog_button_click(ev) {
	    ev = MutableEvent(ev).withActionInfo();

	    if (ev.commandRole == "button") return; // skip the show-menu

	    if (ev.commandElement) {
	        if (ev.stateful && ev.stateful("state.disabled")) return; // disable
	        if (ev.ariaDisabled) return; //TODO fold into stateful

	        EnhancedDescriptor.all[this.uniqueID].instance.click(ev);
	        ev.stopPropagation();
	    }

	    if (ev.defaultPrevented) return false;
	}


	function enhance_navigation(el,role,config) {
	    var navigation = new Navigation(el,config);
	    return navigation;
	}

	function layout_navigation(el,layout,instance) {

	}

	function discard_navigation(el,role,instance) {
	    if (instance) instance.destroy(el);
	}

	Resolver("page").set("handlers.enhance.navigation", enhance_navigation);
	Resolver("page").set("handlers.layout.navigation", layout_navigation);
	Resolver("page").set("handlers.discard.navigation", discard_navigation);


}();

