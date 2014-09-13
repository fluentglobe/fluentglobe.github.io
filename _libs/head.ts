/// <reference path="../../libs/DefinitelyTyped/essentialjs/essential.d.ts"/>
/// <reference path="../../libs/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="head.d.ts"/>
//-/ <reference path="../../libs/immerse.js/lib/resolved.ts"/>
//-/ <reference path="../../libs/immerse.js/lib/navigation.ts"/>

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

}();

