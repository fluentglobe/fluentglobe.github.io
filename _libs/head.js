!function() {
	var Layouter = Resolver("essential::Layouter::"),
		docResolver = Resolver("document"),
		addEventListeners = Resolver("essential::addEventListeners::"),
		MutableEvent = Resolver("essential::MutableEvent::"),
		EnhancedDescriptor = Resolver("essential::EnhancedDescriptor::"),
		Placement = Resolver("essential::ElementPlacement::"),
		HTMLElement = Resolver("essential::HTMLElement::"),
		pageState = Resolver("page::state"),
		state = Resolver("document::essential.state");

	state.declare({});
	state.set("authenticated",false);
	state.set("authorised",false);
	pageState.set("authenticated",false);
	pageState.set("authorised",false);
	state.on("change",function(ev) {
		if (ev.symbol == "authenticated" && !ev.value) {
			session.set("username","");
			session.set("access_token","");
			session.set("password",false);
			nextSession.set("access_token","");
			state.set("authorised",false);

		    //TODO (essential.session).wipeStored()
		}
		pageState.set("authenticated", ev.base.authenticated);
		pageState.set("authorised", ev.base.authorised);
	});

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

	var language = Resolver("document::essential.language"),
		countryCode = Resolver("document::essential.countryCode");
	language.declare("English"); //TODO calculate value support in Resolver ?
	countryCode.declare("uk");

	geoip.on("change",function(ev) {
		var base = ev.symbol == "geoip"? ev.value:ev.base;
		if (typeof base.country_code == "string") countryCode.set(base.country_code.toLowerCase());
	});

	Resolver("document::essential.lang").on("change",function(ev) {
		switch(ev.value) {
			case "en": language.set("English"); break;
			case "fr": language.set("Francais"); break;
			case "de": language.set("Deutsch"); break;
			case "es": language.set("Español"); break;
			case "pt": language.set("Portuguese"); break;
			case "it": language.set("Italiano"); break;
			case "pl": language.set("Polski"); break;
			case "cs": language.set("Čeština"); break;
			case "ar": language.set("العربية"); break;
			case "ru": language.set("Русский"); break;
			case "ch": language.set("中国的"); break;
			case "jp": language.set("日本人"); break;
		}
	});

	var user = Resolver("document::essential.user");
	user.declare({
		name: "",
		email: "",
		phone: ""
	});
	user.stored("load change","session"); //TODO on app local storage

	var session = Resolver("document::essential.session");
	session.declare({
		userid: "",
		username: "",
		access_token: "",
		password: false 	// username is password protected
	});
	session.stored("load change","session");

	var nextSession = Resolver("document::essential.nextSession");
	nextSession.declare({
		access_token: ""
	});
	nextSession.stored("load change","local");

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
			if (body.length) body[0].conf.sizingElement = true;
			body.enhance();
		}
	});

	function classRenderSelector(resolver) {
		this.el.className = this.baseClass + resolver(this.selectors[0]);
	}

	//TODO put in Essential
	HTMLElement.fn.makeClassSubstitution = function(el,selector) {
		var baseClass = el.className; if (baseClass) baseClass += " ";

		return {
			el: el,
			baseClass: baseClass,
			selectors: [selector],
			renderClass: classRenderSelector
		};
	};

	function styleRenderSelector(resolver) {
		this.el.style[this.prop] = resolver(this.selectors[0]);
	}

	HTMLElement.fn.makeStyleSubstitution = function(el,prop,selector) {
		// el.style[prop] = 
		return {
			el: el,
			prop: prop,
			selectors: [selector],
			renderStyle: styleRenderSelector
		};
	};

	var policy = {
		DECORATORS: {
			"data-resolve": {
				props: true
			}
		}
	};

	function prepare_resolved(el) {
		var els = el.getElementsByTagName("*"), text = [], 
			queued = el.queued = [],
			attrs, dataResolve;

		attrs = HTMLElement.fn.describeAttributes(el,policy);
		attrs.texts = [];
		attrs.classes = [];
		attrs.styles = [];
		//TODO support data-resolve on root element ?

		if (attrs.texts.length === 0) {
			attrs.texts = attrs.texts.concat(HTMLElement.fn.findTextSubstitutions(el));
		}

		if (attrs.texts.length || dataResolve) {
			attrs.el = el;
			queued.push(attrs);
			for(var i=0,t; t = attrs.texts[i]; ++i) t.renderText.call(t,docResolver);
			//TODO renderAttrs class title placeholder
		}

		for(var i=0,ce; ce = els[i]; ++i) {
			attrs = HTMLElement.fn.describeAttributes(ce,policy);
			dataResolve = attrs["data-resolve"];

			attrs.texts = [];
			attrs.classes = [];
			attrs.styles = [];

			if (dataResolve) {
				if (dataResolve.props.text) {
					attrs.texts.push(HTMLElement.fn.makeTextSubstitution(ce,dataResolve.props.text));
				}
				if (dataResolve.props.html) {
					//TODO makeHtmlSubstitution
				}
				if (dataResolve.props["class"]) {
					attrs.classes.push(HTMLElement.fn.makeClassSubstitution(ce,dataResolve.props["class"]));
				}
				if (dataResolve.props["width"]) {
					attrs.styles.push(HTMLElement.fn.makeStyleSubstitution(ce,"width",dataResolve.props["width"]));
				}
			} 
			if (attrs.texts.length === 0) {
				// nested text if not in attribute
				attrs.texts = attrs.texts.concat(HTMLElement.fn.findTextSubstitutions(ce));
			}

			if (attrs.texts.length || dataResolve) {
				attrs.el = ce;
				queued.push(attrs);
				for(var j=0,t; t = attrs.texts[j]; ++j) t.renderText.call(t,docResolver);
				//TODO renderAttrs class title placeholder
			}
		}
	}

	Resolver("page").declare("handlers.prepare.resolved", prepare_resolved);

	function textRefresher(t,resolver) {
		return function(ev) {
			t.renderText.call(t,resolver);
		};
	}

	function textUpdaters(attrs,resolver) {
		for(var i=0,t; t = attrs.texts[i]; ++i) {
			t.renderText.call(t,resolver);
			for(var j=0,s; s = t.selectors[i]; ++i) if (s.indexOf("::")>=0) {
				var parts = s.split("::");
				Resolver(parts[0]).on("change",parts[1],textRefresher(t,resolver));
			} else {
				resolver.on("change",s,textRefresher(t,resolver));
			}
		}
	}

	function classRefresher(c,resolver) {
		return function(ev) {
			c.renderClass.call(c,resolver);
		};
	}

	function styleRefresher(c,resolver) {
		return function(ev) {
			c.renderStyle.call(c,resolver);
		};
	}

	function classUpdaters(attrs,resolver) {
		for(var i=0,c; c = attrs.classes[i]; ++i) {
			c.renderClass.call(c,resolver);
			for(var j=0,s; s = c.selectors[j]; ++j) if (s.indexOf("::")>=0) {
				var parts = s.split("::");
				Resolver(parts[0]).on("change",parts[1],classRefresher(c,resolver));
			} else {
				resolver.on("change",s,classRefresher(c,resolver));
			}
		}
	}

	function styleUpdaters(attrs,resolver) {
		for(var i=0,c; c = attrs.styles[i]; ++i) {
			c.renderStyle.call(c,resolver);
			for(var j=0,s; s = c.selectors[j]; ++j) if (s.indexOf("::")>=0) {
				var parts = s.split("::");
				Resolver(parts[0]).on("change",parts[1],styleRefresher(c,resolver));
			} else {
				resolver.on("change",s,styleRefresher(c,resolver));
			}
		}
	}

	Resolver("page").declare("handlers.enhance.resolved", function(el,role,config,context) {

		if (el.queued) {
			for(var i=0,q; q = el.queued[i]; ++i) {
				textUpdaters(q,el.stateful);
				classUpdaters(q,el.stateful);
				styleUpdaters(q,el.stateful);
			}
			//TODO update on any part change
			//TODO update state.blank
			el.queued = undefined;
		}
	});


	function Navigation(el,config) {
	    this.stateful = el.stateful;

	    addEventListeners(el, {
	        // "change": form_input_change,
	        "click": dialog_button_click
	    },false);

		if (el.queued) {
			for(var i=0,q; q = el.queued[i]; ++i) {
				textUpdaters(q,el.stateful);
				classUpdaters(q,el.stateful);
			}
			//TODO update on any part change
			//TODO update state.blank
			el.queued = undefined;
		}

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
		var prevent = false;
	    if (ev.commandRole == "menuitem") {
	        var config = Resolver.config(ev.commandElement);
	        if (config.select) {
	            this.stateful.set(config.select,config.value);
	            prevent = true;
	        }
	        
	        // model.language
	        // ev.commandElement.stateful.set("state.selected",true);
	        return prevent;
	    }
	};

	function dialog_button_click(ev) {
	    ev = MutableEvent(ev).withActionInfo();

	    if (ev.commandRole == "button") return; // skip the show-menu

	    if (ev.commandElement) {
	        if (ev.stateful && ev.stateful("state.disabled")) return; // disable
	        if (ev.ariaDisabled) return; //TODO fold into stateful

	        if (EnhancedDescriptor.all[this.uniqueID].instance.click(ev)) {
		        ev.stopPropagation();
	        }
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

	Resolver("page").declare("handlers.prepare.navigation", prepare_resolved);
	Resolver("page").set("handlers.enhance.navigation", enhance_navigation);
	Resolver("page").set("handlers.layout.navigation", layout_navigation);
	Resolver("page").set("handlers.discard.navigation", discard_navigation);


}();

