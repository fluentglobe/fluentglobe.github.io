module fluentbook {

var essential = Resolver("essential"),
	pageResolver = Resolver("page"),
	EnhancedDescriptor = essential("EnhancedDescriptor"),
	HTMLElement = essential("HTMLElement"),
	MutableEvent = essential("MutableEvent"),
	fireAction = essential("fireAction"),
	addEventListeners = essential("addEventListeners"),
	XMLHttpRequest = essential("XMLHttpRequest"),
	StatefulResolver = essential("StatefulResolver");

var effectiveRole = essential("effectiveRole"), roleAccessor = essential("roleAccessor");

if (! /PhantomJS\//.test(navigator.userAgent)) {
	Resolver("page").set("map.class.notstate.connected","disconnected");
}

function updateConnected() {
	if (pageResolver("state.online") == false) {
    	pageResolver.set("state.connected",false);
        setTimeout(updateConnected,15000);
		return;
	}

	//var url = "http://localhost:3000";

	// var url = "http://api.learnrighthere.com"; // support OPTIONS
	// var xhr = XMLHttpRequest();
	// xhr.open("OPTIONS",url,true);

	var url = "https://email.fluentglobe.com/t/i/s/pdtdj/";
	var xhr = XMLHttpRequest();
	xhr.open("GET",url,true);
	xhr.onreadystatechange = function(ready) {
	    if (xhr.readyState == 4 /* complete */) {
	        if (xhr.status == 200 || xhr.status == 304) {
	        	pageResolver.set("state.connected",true);
		        setTimeout(updateConnected,30000);
	        }
	        else {
	        	pageResolver.set("state.connected",false);
		        setTimeout(updateConnected,10000);
	        }
	    }
	};
	xhr.send("");
}
// setTimeout(updateConnected,100); //TODO configurable with algorithm

var parseOptions;

function parseURI (str) {
	var	o   = parseOptions,
		m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
		uri = {},
		i   = 14;

	while (i--) uri[o.key[i]] = m[i] || "";

	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
		if ($1) uri[o.q.name][$1] = $2;
	});
	uri.toString = parseURI.toString;

	return uri;
};

parseOptions = parseURI['options'] = {
	strictMode: false,
	key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
	q:   {
		name:   "queryKey",
		parser: /(?:^|&)([^&=]*)=?([^&]*)/g
	},
	parser: {
		strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
		loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	}
};

parseURI.toString = function() {
	return this.protocol + "://" + this.host + (this.port? ":"+this.port : "") + this.path + (this.query? "?" + this.query:"");
};

function buildURI(uri) {
	return parseURI.toString.call(uri);
}

var newIframeId = 1;


function EnhancedForm(el,config) {

	// f.method=null; f.action=null;
	el.onsubmit = form_onsubmit;
	el.__builtinSubmit = el.submit;
	el.submit = form_submit;
	el.__builtinBlur = el.blur;
	el.blur = form_blur;
	el.__builtinFocus = el.focus;
	el.focus = form_focus;

	this.namedElements = {};

	this.stateful = el.stateful;
	this.stateful.set("map.class.state.subscribed","state-subscribed")
	this.stateful.set("state.subscribed",false); // for clarity

	this.inIframeSubmit = false;

	// Strategy determines if element should be stateful and the effective role
	var strategyRole = el.stateful("strategy.role","undefined") || effectiveRole;
	for(var i=0,node; node = el.elements[i]; ++i) {
		if (node.accessor == undefined) {
			var role = strategyRole(node);
			var accessor = roleAccessor(role);
			accessor.init(role,el,node)
			node.accessor = accessor;
			//TODO add cleaner for accessor

			var name = node.getAttribute("name");
			if (name) {
				this.namedElements[name] = node;
				node.originalName = name;
			}
		}

		if (node.tagName == "BUTTON" && node.getAttribute("role") == null) {
			node.setAttribute("role","button"); //TODO effective role
		}
	}

	//TODO catch IE submit buttons

	addEventListeners(el, {
		"change": form_input_change,
		"click": dialog_button_click
	},false);


	this.actionParts = parseURI(el.action);

	// this.url = new URI(el.action);
	//TODO enhance/stateful buttons

	// applyDefaultRole(el.getElementsByTagName("BUTTON"));
	// applyDefaultRole(el.getElementsByTagName("A"));
	//TODO input

	var enctype = el.getAttribute("enctype");

	switch(enctype) {
		case "application/json":
		case "text/json":
			this.planJsonSubmit(el);
			break;

		case "text/plain":
		case "application/x-www-form-urlencoded":
		case "multipart/form-data":
			this.planIframeSubmit(el);
			break;

		default:
			break;
	}

	// pop up the results after submit
	this.showSubmitResult = config.showSubmitResult;

	// prepare form for default submit
	this.actions = config.actions;
	if (config.defaultAction) {
		this.applyAction(el,config.defaultAction);
	}

	// allow completion pages to signal
	this.addCompleteListener();
}

// EnhancedForm.prototype.

EnhancedForm.prototype.destroy = function(el) {

	this.namedElements = null;
};

EnhancedForm.prototype.applyAction = function(el,logicName) {
	var logic = this.actions[logicName];
	if (logic) {

		// allow context dependent attribute names
		for(var n in logic.mapName) {
			if (this.namedElements[n]) this.namedElements[n].setAttribute("name",logic.mapName[n]);
		}
		this.actionParts.path = logic.path;
	}
};

// no plan submit
EnhancedForm.prototype.submit = function(el) {}

EnhancedForm.prototype.planJsonSubmit = function(el) {
	this.submit = this.jsonSubmit;
};

EnhancedForm.prototype.jsonSubmit = function(ev,el) {
	var method = "POST"; //TODO config ?
	var actionVariant = ev.actionElement.actionVariant;
	actionVariant.uri = parseURI(this.action);
	if (actionVariant.uri.protocol == "client+http") actionVariant.uri.protocol = "http";
	if (actionVariant.uri.protocol == "client+https") actionVariant.uri.protocol = "https";
	if (actionVariant.host) actionVariant.uri.host = actionVariant.host;

	// http://enable-cors.org/
	var enctype = el.getAttribute("enctype");
	var xhr = new XMLHttpRequest();
	xhr.open(method,actionVariant.uri.toString(),true);
	//xhr.setRequestHeader("Access-Control-Request-Method", "POST");
	//xhr.setRequestHeader("Access-Control-Request-Headers", "x-requested-with");
	xhr.setRequestHeader("Content-Type",enctype + "; charset=utf-8");
	xhr.onreadystatechange = function(ready) {
	    if (xhr.readyState == 4 /* complete */) {
	        if (xhr.status == 200 || xhr.status == 304) {
				if (actionVariant.onsuccess) actionVariant.onsuccess(ready);
	        }
	        else {
				if (actionVariant.onerror) actionVariant.onerror(ready);
	        }
	    }
	};
	//debugger;
	var data = this.stateful("model"); //TODO
	var string = JSON.stringify(data);
	xhr.send(string);
	ev.preventDefault();
};

EnhancedForm.prototype.onIframeLoad = function(ev) {
	ev = MutableEvent(ev);

	// IE/FF does load event on blank iframes, and no way to identify from attributes
	if (this.inIframeSubmit && ev.target == this.targetIframe) {

		if (this.showSubmitResult && !this.processComplete) {
			ev.target.stateful.set("state.hidden",false);
			//TODO pop it up
		}
		this.stateful.set("state.subscribed",true);

		this.inIframeSubmit = false;
	}
}

EnhancedForm.prototype.addCompleteListener = function() {

// the iframe must be shown in multi-step forms until completion

//TODO make generic
try {
    window.addEventListener("message",function(ev) {
        //TODO support this in form with a flag
        //TODO perhaps guard origin being from the expected domain
        if (ev.data == this.iframeId + " complete") {
            this.targetIframe.stateful.set("state.hidden",true);
            this.processComplete = true;
        }
    }.bind(this),false);
    
} catch(ex) {
    // ignore
}

};


EnhancedForm.prototype.planIframeSubmit = function(el) {
	this.iframeId = el.target || "form-target-" + (newIframeId++);
	var eFrame = document[this.iframeId]? document[this.iframeId].frameElement : document.getElementById(this.iframeId); // name first then ID

	if (eFrame == null) {
		this.targetIframe = HTMLElement("iframe",{
			"id": this.iframeId, "name": this.iframeId,
			"frameborder":"0", "border":"0",
			"make stateful": true,
			"append to":el
		});
	} 

	else {
		this.targetIframe = eFrame;
		StatefulResolver(eFrame,true);		
	}
	this.targetIframe.stateful.set("state.hidden",true);
	this.targetIframe.onload = this.onIframeLoad.bind(this);

	el.target = this.iframeId;
	this.actionParts.protocol = this.actionParts.protocol.replace("client+http","http");
	this.submit = this.iframeSubmit;
};

EnhancedForm.prototype.iframeSubmit = function(ev,el) {
	// var enctype = this.getAttribute("enctype");

	this.inIframeSubmit = true;
	var action = buildURI(this.actionParts);
	el.setAttribute("action",action);
	el.__builtinSubmit();
};



function form_blur() {
	for(var i=0,e; (e=this.elements[i]); ++i) { e.blur(); }
}
function form_focus() {
	for(var i=0,e; (e=this.elements[i]); ++i) {
		var autofocus = e.getAttribute("autofocus"); // null/"" if undefined
		if (!autofocus) continue;
		e.focus();
		break; 
	}
}

function form_onsubmit(ev) {
	var frm = this;
	setTimeout(function(){
		frm.submit(ev);
	},0);
	return false;
}

function form_do_submit(ev) {
	var desc = EnhancedDescriptor(this);
	desc.instance.submit(ev,this);
}

function form_submit(ev) {
	if (document.activeElement) { (<HTMLElement>document.activeElement).blur(); }
	this.blur();

	if (ev && ev.success) {
		// host, origin, target
	}
	dialog_submit.call(this,ev);
}

function dialog_submit(clicked) {
	if (clicked == undefined) { clicked = MutableEvent().withDefaultSubmit(this); }

	//TODO matching action
	if (clicked.commandElement && clicked.commandName) {
		fireAction(clicked);
	} else if (clicked.actionElement) {
		var actionDesc = EnhancedDescriptor(clicked.actionElement);
		if (actionDesc && actionDesc.instance) actionDesc.instance.submit(clicked,clicked.actionElement);
	}
	//else {
		//TODO default submit when no submit button or event
	//}
}

function form_input_change(ev) {
	ev = MutableEvent(ev);

	switch(ev.target.type) {
		// shouldn't get: button submit reset
		case "checkbox":
			this.stateful.set(["model",ev.target.name],ev.target.checked);
			break;
		case "radio":
		// email number date datetime datetime-local time week tel url
		//  month file image month range search 
		default:
			// hidden text password
			this.stateful.set(["model",ev.target.name],ev.target.value);
			break;
	}
}

function dialog_button_click(ev) {
	ev = MutableEvent(ev).withActionInfo();

	if (ev.commandElement) {
		if (ev.stateful && ev.stateful("state.disabled")) return; // disable
		if (ev.ariaDisabled) return; //TODO fold into stateful

		this.submit(ev); //TODO action context
		ev.stopPropagation();

		//TODO not the best place to do submit
		if (!ev.defaultPrevented && ev.commandElement.type == "submit") form_do_submit.call(this,ev);
	}
	if (ev.defaultPrevented) return false;
}



function applyDefaultRole(elements) {
	for(var i=0,el; (el = elements[i]); ++i) {
		var stateful = StatefulResolver(el,true);
		stateful.set("state.disabled",el.disabled);
		stateful.set("state.hidden",el.hidden);
		stateful.set("state.readOnly",el.readOnly);
		//TODO read state readOnly,hidden,disabled

		switch(el.tagName) {
			case "button":
			case "BUTTON":
				el.setAttribute("role","button");
				break;
			case "a":
			case "A":
				el.setAttribute("role","link");
				break;
			// menuitem
		}
	} 
}


function enhance_form(el,role,config) {
	var clientType = (el.action.substring(0,12) == "client+http:") || (el.action.substring(0,13) == "client+https:");

	if (clientType) {
		return new EnhancedForm(el,config);
	}
}

function layout_form(el,layout,instance) {

}

function discard_form(el,role,instance) {
	if (instance) instance.destroy(el);
}

Resolver("page").declare("handlers.enhance.form", enhance_form);
Resolver("page").declare("handlers.layout.form", layout_form);
Resolver("page").declare("handlers.discard.form", discard_form);

}



/* CM country selection

        <select id="fieldbjum" name="cm-fo-bjum">
            <option value="216379">Afghanistan</option>
            <option value="216380">Albania</option>
            <option value="216381">Algeria</option>
            <option value="216382">American Samoa</option>
            <option value="216383">Andorra</option>
            <option value="216384">Angola</option>
            <option value="216385">Anguilla</option>
            <option value="216386">Antigua &amp; Barbuda</option>
            <option value="216387">Argentina</option>
            <option value="216388">Armenia</option>
            <option value="216389">Aruba</option>
            <option value="216390">Australia</option>
            <option value="216391">Austria</option>
            <option value="216392">Azerbaijan</option>
            <option value="216393">Azores</option>
            <option value="216394">Bahamas</option>
            <option value="216395">Bahrain</option>
            <option value="216396">Bangladesh</option>
            <option value="216397">Barbados</option>
            <option value="216398">Belarus</option>
            <option value="216399">Belgium</option>
            <option value="216400">Belize</option>
            <option value="216401">Benin</option>
            <option value="216402">Bermuda</option>
            <option value="216403">Bhutan</option>
            <option value="216404">Bolivia</option>
            <option value="216405">Bonaire</option>
            <option value="216406">Bosnia &amp; Herzegovina</option>
            <option value="216407">Botswana</option>
            <option value="216408">Brazil</option>
            <option value="216409">British Indian Ocean Ter</option>
            <option value="216410">Brunei</option>
            <option value="216411">Bulgaria</option>
            <option value="216412">Burkina Faso</option>
            <option value="216413">Burundi</option>
            <option value="216414">Cambodia</option>
            <option value="216415">Cameroon</option>
            <option value="216416">Canada</option>
            <option value="216417">Canary Islands</option>
            <option value="216418">Cape Verde</option>
            <option value="216419">Cayman Islands</option>
            <option value="216420">Central African Republic</option>
            <option value="216421">Chad</option>
            <option value="216422">Channel Islands</option>
            <option value="216423">Chile</option>
            <option value="216424">China</option>
            <option value="216425">Christmas Island</option>
            <option value="216426">Cocos Island</option>
            <option value="216427">Colombia</option>
            <option value="216428">Comoros</option>
            <option value="216429">Congo</option>
            <option value="216430">Congo Democratic Rep</option>
            <option value="216431">Cook Islands</option>
            <option value="216432">Costa Rica</option>
            <option value="216433">Cote D&#x27;Ivoire</option>
            <option value="216434">Croatia</option>
            <option value="216435">Cuba</option>
            <option value="216436">Curacao</option>
            <option value="216437">Cyprus</option>
            <option value="216438">Czech Republic</option>
            <option value="216439">Denmark</option>
            <option value="216440">Djibouti</option>
            <option value="216441">Dominica</option>
            <option value="216442">Dominican Republic</option>
            <option value="216443">East Timor</option>
            <option value="216444">Ecuador</option>
            <option value="216445">Egypt</option>
            <option value="216446">El Salvador</option>
            <option value="216447">Equatorial Guinea</option>
            <option value="216448">Eritrea</option>
            <option value="216449">Estonia</option>
            <option value="216450">Ethiopia</option>
            <option value="216451">Falkland Islands</option>
            <option value="216452">Faroe Islands</option>
            <option value="216453">Fiji</option>
            <option value="216454">Finland</option>
            <option value="216455">France</option>
            <option value="216456">French Guiana</option>
            <option value="216457">French Polynesia</option>
            <option value="216458">French Southern Ter</option>
            <option value="216459">Gabon</option>
            <option value="216460">Gambia</option>
            <option value="216461">Georgia</option>
            <option value="216462">Germany</option>
            <option value="216463">Ghana</option>
            <option value="216464">Gibraltar</option>
            <option value="216465">Great Britain</option>
            <option value="216466">Greece</option>
            <option value="216467">Greenland</option>
            <option value="216468">Grenada</option>
            <option value="216469">Guadeloupe</option>
            <option value="216470">Guam</option>
            <option value="216471">Guatemala</option>
            <option value="216472">Guernsey</option>
            <option value="216473">Guinea</option>
            <option value="216474">Guinea-Bissau</option>
            <option value="216475">Guyana</option>
            <option value="216476">Haiti</option>
            <option value="216477">Honduras</option>
            <option value="216478">Hong Kong</option>
            <option value="216479">Hungary</option>
            <option value="216480">Iceland</option>
            <option value="216481">India</option>
            <option value="216482">Indonesia</option>
            <option value="216483">Iran</option>
            <option value="216484">Iraq</option>
            <option value="216485">Ireland</option>
            <option value="216486">Isle of Man</option>
            <option value="216487">Israel</option>
            <option value="216488">Italy</option>
            <option value="216489">Jamaica</option>
            <option value="216490">Japan</option>
            <option value="216491">Jersey</option>
            <option value="216492">Jordan</option>
            <option value="216493">Kazakhstan</option>
            <option value="216494">Kenya</option>
            <option value="216495">Kiribati</option>
            <option value="216496">Korea North</option>
            <option value="216497">Korea South</option>
            <option value="216498">Kuwait</option>
            <option value="216499">Kyrgyzstan</option>
            <option value="216500">Laos</option>
            <option value="216501">Latvia</option>
            <option value="216502">Lebanon</option>
            <option value="216503">Lesotho</option>
            <option value="216504">Liberia</option>
            <option value="216505">Libya</option>
            <option value="216506">Liechtenstein</option>
            <option value="216507">Lithuania</option>
            <option value="216508">Luxembourg</option>
            <option value="216509">Macau</option>
            <option value="216510">Macedonia</option>
            <option value="216511">Madagascar</option>
            <option value="216512">Malawi</option>
            <option value="216513">Malaysia</option>
            <option value="216514">Maldives</option>
            <option value="216515">Mali</option>
            <option value="216516">Malta</option>
            <option value="216517">Marshall Islands</option>
            <option value="216518">Martinique</option>
            <option value="216519">Mauritania</option>
            <option value="216520">Mauritius</option>
            <option value="216521">Mayotte</option>
            <option value="216522">Mexico</option>
            <option value="216523">Midway Islands</option>
            <option value="216524">Moldova</option>
            <option value="216525">Monaco</option>
            <option value="216526">Mongolia</option>
            <option value="216527">Montenegro</option>
            <option value="216528">Montserrat</option>
            <option value="216529">Morocco</option>
            <option value="216530">Mozambique</option>
            <option value="216531">Myanmar</option>
            <option value="216532">Namibia</option>
            <option value="216533">Nauru</option>
            <option value="216534">Nepal</option>
            <option value="216535">Netherland Antilles</option>
            <option value="216536">Netherlands</option>
            <option value="216537">Nevis</option>
            <option value="216538">New Caledonia</option>
            <option value="216539">New Zealand</option>
            <option value="216540">Nicaragua</option>
            <option value="216541">Niger</option>
            <option value="216542">Nigeria</option>
            <option value="216543">Niue</option>
            <option value="216544">Norfolk Island</option>
            <option value="216545">Norway</option>
            <option value="216546">Oman</option>
            <option value="216547">Pakistan</option>
            <option value="216548">Palau Island</option>
            <option value="216549">Palestine</option>
            <option value="216550">Panama</option>
            <option value="216551">Papua New Guinea</option>
            <option value="216552">Paraguay</option>
            <option value="216553">Peru</option>
            <option value="216554">Philippines</option>
            <option value="216555">Pitcairn Island</option>
            <option value="216556">Poland</option>
            <option value="216557">Portugal</option>
            <option value="216558">Puerto Rico</option>
            <option value="216559">Qatar</option>
            <option value="216560">Reunion</option>
            <option value="216561">Romania</option>
            <option value="216562">Russia</option>
            <option value="216563">Rwanda</option>
            <option value="216564">Saipan</option>
            <option value="216565">Samoa</option>
            <option value="216566">Samoa American</option>
            <option value="216567">San Marino</option>
            <option value="216568">Sao Tome &amp; Principe</option>
            <option value="216569">Saudi Arabia</option>
            <option value="216570">Senegal</option>
            <option value="216571">Serbia</option>
            <option value="216572">Serbia &amp; Montenegro</option>
            <option value="216573">Seychelles</option>
            <option value="216574">Sierra Leone</option>
            <option value="216575">Singapore</option>
            <option value="216576">Slovakia</option>
            <option value="216577">Slovenia</option>
            <option value="216578">Solomon Islands</option>
            <option value="216579">Somalia</option>
            <option value="216580">South Africa</option>
            <option value="216581">South Sudan</option>
            <option value="216582">Spain</option>
            <option value="216583">Sri Lanka</option>
            <option value="216584">St Barthelemy</option>
            <option value="216585">St Eustatius</option>
            <option value="216586">St Helena</option>
            <option value="216587">St Kitts-Nevis</option>
            <option value="216588">St Lucia</option>
            <option value="216589">St Maarten</option>
            <option value="216590">St Pierre &amp; Miquelon</option>
            <option value="216591">St Vincent &amp; Grenadines</option>
            <option value="216592">Sudan</option>
            <option value="216593">Suriname</option>
            <option value="216594">Swaziland</option>
            <option value="216595">Sweden</option>
            <option value="216596">Switzerland</option>
            <option value="216597">Syria</option>
            <option value="216598">Tahiti</option>
            <option value="216599">Taiwan</option>
            <option value="216600">Tajikistan</option>
            <option value="216601">Tanzania</option>
            <option value="216602">Thailand</option>
            <option value="216603">Togo</option>
            <option value="216604">Tokelau</option>
            <option value="216605">Tonga</option>
            <option value="216606">Trinidad &amp; Tobago</option>
            <option value="216607">Tunisia</option>
            <option value="216608">Turkey</option>
            <option value="216609">Turkmenistan</option>
            <option value="216610">Turks &amp; Caicos Is</option>
            <option value="216611">Tuvalu</option>
            <option value="216612">Uganda</option>
            <option value="216613">Ukraine</option>
            <option value="216614">United Arab Emirates</option>
            <option value="216615">United Kingdom</option>
            <option value="216616">United States of America</option>
            <option value="216617">Uruguay</option>
            <option value="216618">Uzbekistan</option>
            <option value="216619">Vanuatu</option>
            <option value="216620">Vatican City State</option>
            <option value="216621">Venezuela</option>
            <option value="216622">Vietnam</option>
            <option value="216623">Virgin Islands (Brit)</option>
            <option value="216624">Virgin Islands (USA)</option>
            <option value="216625">Wake Island</option>
            <option value="216626">Wallis &amp; Futana Is</option>
            <option value="216627">Yemen</option>
            <option value="216628">Zambia</option>
            <option value="216629">Zimbabwe</option>
        </select>
*/


