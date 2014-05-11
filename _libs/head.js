!function() {
	var Layouter = Resolver("essential::Layouter::");

	Layouter.variant("intro-plus-article",Generator(function(key,el,conf) {

		this.lowBoundsWidth = conf.lowBoundsWidth || 800;
		this.afterContent = conf.afterContent || 100;
		// this.placeParts(el);
		this.article = el.querySelector("article");
		this.tracer = el.querySelector("tracer");
		this.intro = el.querySelector("#intro");
		this.introFooter = el.querySelector("#intro > footer");

	},Layouter,{ 
		prototype: {

			"layout": function(el,layout,sizingEls) {
				//TODO add tracer element instead of having it in frontpage.html

				//TODO configurable after content gap
				var contentHeight = this.introFooter? this.introFooter.offsetTop : layout.height,
					bgWidth = this.tracer? this.tracer.offsetWidth : layout.width, bgHeight = this.tracer? this.tracer.offsetHeight : layout.height;

	            var maxHeight = Math.min(bgHeight,layout.height);
				var introHeight = layout.height;

				if (layout.width <= this.lowBoundsWidth) {
		            maxHeight = Math.min(bgHeight, contentHeight + this.afterContent);
					if (this.intro) this.intro.style.maxHeight = maxHeight + "px";
					if (this.article) this.article.style.top = "";
				}
				else {
		            // relative dimensions
		            if (bgHeight < bgWidth) maxHeight = Math.floor(Math.max(bgHeight,(layout.width * bgHeight / bgWidth)));

		            // no more than content in intro
		            maxHeight = Math.min(maxHeight, contentHeight + this.afterContent);

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
			var body = Resolver("essential::DescriptorQuery::")(document.body);
			body[0].conf.sizingElement = true;
			body.enhance();
		}
	});

}();

