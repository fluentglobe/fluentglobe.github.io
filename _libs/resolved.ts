module essential_roles {

	var policy = {
		DECORATORS: {
			"data-resolve": {
				props: true
			}
		}
	};

	Resolver("page").declare("handlers.prepare.resolved", function(el,role) {
		var els = el.getElementsByTagName("*"), text = [], 
			queued = el.queued = [],
			attrs, dataResolve;

		attrs = HTMLElement.fn.describeAttributes(el,policy);
		attrs.texts = [];
		//TODO support data-resolve on root element ?

		if (attrs.texts.length === 0) {
			attrs.texts = attrs.texts.concat(HTMLElement.fn.findTextSubstitutions(el));
		}

		if (attrs.texts.length || dataResolve) {
			attrs.el = el;
			queued.push(attrs);
			for(var i=0,t; t = attrs.texts[i]; ++i) t.renderText.call(t,pageResolver);
			//TODO renderAttrs class title placeholder
		}

		for(var i=0,ce; ce = els[i]; ++i) {
			attrs = HTMLElement.fn.describeAttributes(ce,policy);
			dataResolve = attrs["data-resolve"];

			attrs.texts = [];

			if (dataResolve) {
				if (dataResolve.props.text) {
					attrs.texts.push(HTMLElement.fn.makeTextSubstitution(ce,dataResolve.props.text));
				}
				if (dataResolve.props.html) {
					//TODO makeHtmlSubstitution
				}
			} 
			if (attrs.texts.length === 0) {
				// nested text if not in attribute
				attrs.texts = attrs.texts.concat(HTMLElement.fn.findTextSubstitutions(ce));
			}

			if (attrs.texts.length || dataResolve) {
				attrs.el = ce;
				queued.push(attrs);
				for(var j=0,t; t = attrs.texts[j]; ++j) t.renderText.call(t,pageResolver);
				//TODO renderAttrs class title placeholder
			}
		}

	});

	Resolver("page").declare("handlers.enhance.resolved", function(el,role,config,context) {

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

		if (el.queued) {
			for(var i=0,q; q = el.queued[i]; ++i) {
				textUpdaters(q,el.stateful);
			}
			//TODO update on any part change
			//TODO update state.blank
			el.queued = undefined;
		}
	});

}
