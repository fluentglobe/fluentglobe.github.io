!function() {
	var Layouter = Resolver("essential::Layouter::"),
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

}();

