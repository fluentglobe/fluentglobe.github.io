!function() {

var essential = Resolver("essential"),
    ApplicationConfig = essential("ApplicationConfig"),

    console = essential("console"),
    StatefulResolver = essential("StatefulResolver"),
    addEventListeners = essential("addEventListeners"),
    MutableEvent = essential("MutableEvent"),
    EnhancedDescriptor = essential("EnhancedDescriptor"),
    DescriptorQuery = essential("DescriptorQuery"),
    ElementPlacement = essential("ElementPlacement"),
    Layouter = essential("Layouter"),
    Laidout = essential("Laidout"),
    HTMLElement = essential("HTMLElement"),
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



// section level
Layouter.variant("paged-section",Generator(function(key,el,conf) {
    this.el = el;
    this.gapY = conf.gap || 0;
    this.sizing = el.stateful("sizing");
    this.columns = []; // zero based, 1 less than .no

},Layouter,{ prototype: {

    "init": function(el,conf,sizing,layout) {
        var col = 0, existing = false, column, columns = [], 
            placement = ElementPlacement(el.firstChild,["breakBefore","breakAfter"],false);

        while(el.firstChild && el.firstChild.laidoutPage == undefined) {
        	var fc = el.firstChild;
        	
            if (fc.tagName !== undefined) {
                placement.compute(fc);
                var breaks = placement.style["breakBefore"] || placement.style["breakAfter"];

            	if (breaks == "auto" && fc.firstChild && fc.firstChild == fc.lastChild && fc.firstChild.tagName == "BR") {
            		breaks = fc.firstChild.className;
            		fc.parentNode.removeChild(fc);
					fc = fc.firstChild;           		
            	}
            	switch (breaks) {
	            	case "column":
	            	case "page":
	            	case "always":
	            		existing = false;
	            		column.appendChild(fc);
	            		fc = null;
	            		break;
            	}
            }

            if (!existing) {
	            if (column) column.hardEnd = true;
                column = this.getColumn(++col);
                columns.push(column);
                existing = true;
            }

            if (fc) column.appendChild(fc);
        }

        var descs = DescriptorQuery(columns);
        descs.enhance();

    },

    //TODO "destroy" destroy paged sections

    "_addColumn": function(no) {
        var pageEl = HTMLElement("div", { 
            //"class": "column c"+no,
            "data-role": { 'laidout':'section-column','no':no },
            "append to": this.el,
            "enhance element": true
        });
        pageEl.laidoutPage = true;

        return pageEl;
    },
    
    "insertColumn": function(no) {
    	var next = this._addColumn(no);
    	this.el.insertBefore(next, this.columns[no-1]);
		this.columns.splice(no-1, 0, next);
		for(var i=no,c; c = this.columns[i]; ++i) {
			c.laidout.updateNo(c,i+1);
		}    

        return this.columns[no-1];
    },

    "getColumn": function(no) {
        if (this.columns[no-1] == undefined) {
            this.columns[no-1] = this._addColumn(no);
        } 
        return this.columns[no-1];
    },

    "layout":function(el,layout,sizingEls) {

        for(var i = 0, c; c = sizingEls[i]; ++i) {
            var sizing = c.stateful("sizing");
            // switch()
        }
    }
}}));


Laidout.variant("section-column",Generator(
    function(key,el,conf,layouter) {
        this.layouter = layouter;
        this.no = conf.no;
        this.updateNo(el,this.no);
        this.gapY = conf.gap || layouter.gapY || 0;
        this.hardEnd = false;
        this.placement = ElementPlacement(el,["breakBefore","breakAfter"],false);
        this.placement.manually(["paddingTop","paddingBottom"]);
        this.paddingY = parseInt(this.placement.style.paddingTop) + parseInt(this.placement.style.paddingBottom);
        console.debug("col="+this.no,"padding="+this.paddingY);
        this.lineHeight = 12; //TODO measure
    },
    Laidout,
    {"prototype":{

        "calcSizing":function(el,sizing) {
            // contentHeight should be the sum heights by auto

            //TODO could sum up the heights of the content
        },

        "layout": function(el,layout) {
            if (layout.contentHeight > layout.height) {
                // spill to next
                this._spillOverLinear(el,layout);
            }
            else {
                if (! this.hardEnd) {
                    this._pullIn(el,layout);
                }   
            }

        },
        
        "updateNo": function(el,no) {
			this.no = no;
			el.className = "column c"+this.no;	    	    
        },
        
        "_breakRules": function(el) {
	        
            this.placement.compute(el);
            var breaks = {
            	before: this.placement.style["breakBefore"],
            	after: this.placement.style["breakAfter"]
            };
            if (el.tagName == "BR" && breaks.after == "always") switch(el.className) {
	            case "page":
	            case "column":
	            	breaks.after = el.className;
	            	break;
            }
            
            return breaks;
        },
        
        "_whiteSpace": /^\s*$/,
        
        "_guessTextHeight": function(node) {
        	var text = node.data || node.nodeValue;
	    	return this._whiteSpace.test(text)? this.lineHeight : 0;    
        },
        
        "_pullIn": function(el,layout) {
            // look forward to see if there is a block to pull in
            
        },
        
        "_spillOverBisect": function(el,layout) {

	        
        },
        
        "_spillOverLinear": function(el,layout) {

            var toMove = [], breakNow = false, height = el.clientHeight;
            var usedHeight = 0, maxCH = height - this.paddingY - this.gapY;

            //console.debug("layout column",this.no,layout,"h="+maxCH,"oh="+layout.height,"p="+this.paddingY);

            this.hardEnd = false;

            for(var cn=el.childNodes, i=0,c; c = cn[i]; ++i) {

				//TODO judge text node height
                var elHeight = c.offsetHeight || this._guessTextHeight(c), 
                	elTop = c.offsetTop, 
                	elBottom = (elTop? elTop : usedHeight) + elHeight;
                var breaks = this._breakRules(c);
                //console.debug("elh="+elHeight,"elb="+elBottom,"used="+usedHeight,breakNow?"break now":"",c);

                if (breaks.before != "auto") { 
	                breakNow = true;
	                this.hardEnd = true;
                }
				
                if (elBottom > maxCH) breakNow = true;

                if (!breakNow) usedHeight = elBottom;
                else toMove.push(c);

                if (breaks.after != "auto") { 
	                breakNow = true;
	                this.hardEnd = true;
                }
            }

			// move overspill elements to next column, last-first
            if (toMove.length) {

                var nextColumn = this.layouter.getColumn(this.no + 1);
                //TODO add page if last
                if (nextColumn.hardEnd) {
	                nextColumn = this.layouter.insertColumn(this.no + 1);
                }

                while(toMove.length) nextColumn.insertBefore(toMove.pop(),nextColumn.firstChild);
            }
        }

    }}
));



}();