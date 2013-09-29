!function() {

var essential = Resolver("essential"),
    ApplicationConfig = essential("ApplicationConfig"),

    StatefulResolver = essential("StatefulResolver"),
    addEventListeners = essential("addEventListeners"),
    MutableEvent = essential("MutableEvent"),
    EnhancedDescriptor = essential("EnhancedDescriptor"),
	DialogAction = Resolver("essential")("DialogAction");

if (! /PhantomJS\//.test(navigator.userAgent)) {
    Resolver("page").set("map.class.state.online","online");
    Resolver("page").set("map.class.notstate.online","offline");
    Resolver("page").set("map.class.notstate.connected","disconnected");
}

function Navigation(el,config) {
    this.stateful = el.stateful;

    addEventListeners(el, {
        // "change": form_input_change,
        "click": dialog_button_click
    },false);

    var items = el.querySelectorAll("[role=menuitem]");
    for(var i=0,item; item = items[i]; ++i) {
        var config = ApplicationConfig().getConfig(item);
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
        var config = ApplicationConfig().getConfig(ev.commandElement);
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


// --

var FormAction = Generator(function(action) {
},DialogAction);

DialogAction.variant("client+http://fluentglobe.createsend.com",FormAction);

FormAction.prototype["next-what-for"] = function(el,ev) {
	ev.commandElement.type = "button";
    switch(el.stateful("model.what-for")) {
        case "holiday": case "business":
            //el.stateful("state.stage","=","go-where");
            el.stateful.set("state.stage","go-where");
            break;

        case "family":
            //el.stateful("state.stage","=","only-language");
            el.stateful.set("state.stage","only-language");
            break;

        case "correspondence":
        case "other":
            //el.stateful("state.stage","=","how-often");
            el.stateful.set("state.stage","how-often");
            break
    }
};

FormAction.prototype["next-go-where"] = function(el,ev) {
	ev.commandElement.type = "button";
    //el.stateful("state.stage","=","only-language");
    el.stateful.set("state.stage","how-often");
};

FormAction.prototype["next-only-language"] = function(el,ev) {
	ev.commandElement.type = "button";
    //el.stateful("state.stage","=","how-often");
    el.stateful.set("state.stage","how-often");
};

FormAction.prototype["next-how-often"] = function(el,ev) {
	ev.commandElement.type = "button";
    switch(el.stateful("model.how-often")) {
        case "tfwork":
            el.stateful.set("state.stage","tfwork");
            break;
        default:
            el.stateful.set("state.stage","request");
            break;
    }
    //el.stateful("state.stage","=","completed");
};

FormAction.prototype["next-tfwork"] = function(el,ev) {
	ev.commandElement.type = "button";
    //el.stateful("state.stage","=","how-often");
    el.stateful.set("state.stage","request");
};

FormAction.prototype["next-request"] = function(el,ev) {
    var pageState = document.body.stateful("state");
    if (pageState.online && pageState.connected) {
    	//this.host = "henriks-air.local:3000";
    	this.onsuccess = function(ev) {
            //el.stateful("state.stage","=","completed");
            el.stateful.set("state.stage","completed");
            //console.log("Request",el.stateful(["model"]),"undefined");
        };
        this.onerror = function(ev) {

        };
    }
};

FormAction.prototype["start-over"] = function(el,ev) {
    ev.commandElement.type = "button";
    el.stateful.set("state.stage","what-for");
};

/*
    Widget mode tracking


          var starts=1;
          var exists=0;
          
           function update() {
            document.getElementById('open').innerHTML = 'Starts = '+starts;
            document.getElementById('closed').innerHTML = 'Exists = '+exists;
          };
                   
          widget.pauseAudioVisual = function() {
            exists++;
            update();
          };
    
          widget.didEnterWidgetMode = function(x) {
            starts++;
            update();
          };
  

        widget.notifyContentExited = function() {
    
        }

*/


}();