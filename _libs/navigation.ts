module essential_navigation {
	
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


}