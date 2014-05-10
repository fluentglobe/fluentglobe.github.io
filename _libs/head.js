!function() {
	var Layouter = Resolver("essential::Layouter::");

	Layouter.variant("intro-plus-article",Generator(function(key,el,conf) {

		this.lowBoundsWidth = conf.lowBoundsWidth || 800;
		// this.placeParts(el);
		this.article = el.querySelector("article");
		this.tracer = el.querySelector("tracer");
		this.intro = el.querySelector("#intro");
		this.introFooter = el.querySelector("#intro > footer");

		//TODO way to flag immediate layout
		this.layout(el,{ height: el.offsetHeight, width: el.offsetWidth },[]);
	},Layouter,{ 
		prototype: {

			"layout": function(el,layout,sizingEls) {
				//TODO add tracer element instead of having it in frontpage.html

				//TODO configurable after content gap
				var contentHeight = this.introFooter? this.introFooter.offsetTop : layout.height, afterContent = 100,
					bgWidth = this.tracer? this.tracer.offsetWidth : layout.width, bgHeight = this.tracer? this.tracer.offsetHeight : layout.height;

	            var maxHeight = bgHeight;
				var introHeight = layout.height;

				if (bgWidth <= this.lowBoundsWidth) {
					if (this.intro) this.intro.style.maxHeight = "";
					if (this.article) this.article.style.top = "";
				}
				else {
		            // relative dimensions
		            if (bgHeight < bgWidth) maxHeight = Math.floor(Math.max(bgHeight,(layout.width * bgHeight / bgWidth)));

		            // no more than content in intro
		            maxHeight = Math.min(maxHeight, contentHeight + afterContent);

					if (this.intro) {
			            this.intro.style.maxHeight = maxHeight + "px";
						introHeight = this.intro.offsetHeight;
					}

					if (this.article) {

			            if (bgHeight == 0) this.article.style.top = "0";
			            else if (contentHeight) this.article.style.top = introHeight+"px";
					}
				}
			}
		}
	}));

	//TODO move to lib
	Resolver("document::readyState").on("change",function(ev) {
		if (ev.value == "complete" || ev.value == "interactive") {
			Resolver("essential::DescriptorQuery::")(document.body).enhance();
		}
	});

}();

