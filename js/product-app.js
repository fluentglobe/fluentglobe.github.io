(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
*/
!function() {

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

function parseURI (str) {
	var	o   = parseUri.options,
		m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
		uri = {},
		i   = 14;

	while (i--) uri[o.key[i]] = m[i] || "";

	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
		if ($1) uri[o.q.name][$1] = $2;
	});
	uri.toString = parseUri.toString;

	return uri;
};

parseURI.options = {
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


	this.actionParts = URI.parse(el.action);

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

	// prepare form for default submit
	this.actions = config.actions;
	if (config.defaultAction) {
		this.applyAction(el,config.defaultAction);
	}
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

function onIframeLoad(ev) {
	//TODO pop it up
	this.stateful.set("state.hidden",false);
}

EnhancedForm.prototype.planIframeSubmit = function(el) {
	if (this.iframeId == undefined) {
		this.iframeId = "form-target-" + (newIframeId++);

		this.targetIframe = HTMLElement("iframe",{
			"id": this.iframeId, "frameborder":"0", "border":"0",
			"make stateful": true,
			"append to":el
		});
		this.targetIframe.stateful.set("state.hidden",true);
		this.targetIframe.onload = onIframeLoad;
	}

	el.target = this.iframeId;
	this.actionParts.protocol = this.actionParts.protocol.replace("client+http","http");
	this.submit = this.iframeSubmit;
};

EnhancedForm.prototype.iframeSubmit = function(ev,el) {
	// var enctype = this.getAttribute("enctype");

	var action = URI.build(this.actionParts);
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
	if (document.activeElement) { document.activeElement.blur(); }
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
	} else {
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
}();



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



},{}],2:[function(require,module,exports){
!function() {

var essential = Resolver("essential"), StatefulResolver = essential("StatefulResolver");

var ROLE = {
	//TODO optional tweak role function

	form: { role:"form" },
	iframe: {},
	object: {},
	a: { role:"link" },
	img: { role:"img" },

	label: { role:"note" },
	input: {
		role: "textbox",
		//TODO tweak: tweakInputRole(role,el,parent)
		type: {
			// text: number: date: time: url: email:
			// image: file: tel: search: password: hidden:
			range:"slider", checkbox:"checkbox", radio:"radio",
			button:"button", submit:"button", reset:"button"
		}
	},
	select: { role: "listbox" },
	button: { role:"button" },
	textarea: { role:"textbox" },
	fieldset: { role:"group" },
	progress: { role:"progressbar" },

	"default": {
		role:"default"
	}
};

var ACCESSOR = {
	"default": { init:defaultInit },

	form:{ init:defaultInit },
	dialog: { init:defaultInit },
	alertdialog: { init:defaultInit },

	group:{ init:statefulInit },
	progressbar:{ init:statefulInitValue },
	listbox:{ init:statefulInitValue },
	slider:{ init:statefulInitValue },
	checkbox:{ init:statefulInitChecked },
	radio:{ init:statefulInitRadio },
	link:{ init:statefulInit },
	button:{ init:statefulInit },
	img:{ init:defaultInit },
	note:{ init:defaultInit },
	textbox:{ init:statefulInitValue }
};

function defaultInit(role,root,node) {

}

function statefulInit(role,root,node) {

	var stateful = StatefulResolver(node,true);
	stateful.set("state.disabled",node.disabled);
	stateful.set("state.hidden",node.hidden);
	stateful.set("state.readOnly",node.readOnly);
	//TODO read state readOnly,hidden,disabled

}

function statefulInitValue(role,root,node) {
	statefulInit.call(this,role,root,node);
	// set initial value of named elements
	var name = node.name || node.getAttribute("name") || node.getAttribute("data-name"); // named elements
	if (name && root.stateful) {
		//var rootStateful = StatefulResolver(node,true);
		root.stateful.set(["model",name],node.value);
	}
}
function statefulInitChecked(role,root,node) {
	statefulInit.call(this,role,root,node);
	// set initial value of named elements
	var name = node.name || node.getAttribute("name") || node.getAttribute("data-name"); // named elements
	if (name && root.stateful) {
		//var rootStateful = StatefulResolver(node,true);
		root.stateful.set(["model",name],node.checked);
	}
}
function statefulInitRadio(role,root,node) {
	statefulInit.call(this,role,root,node);
	// set initial value of named elements
	var name = node.name || node.getAttribute("name") || node.getAttribute("data-name"); // named elements
	if (name && root.stateful) {
		//var rootStateful = StatefulResolver(node,true);
		if (node.checked) root.stateful.set(["model",name],node.value);
	}
}

/*
	ACCESSOR
	1) if stateful, by stateful("role")
	1) by role
	2) by implied role (tag,type)
*/
function effectiveRole(el) {
	var role;
	if (el.stateful) {
		role = el.stateful("impl.role","undefined");
		if (role) return role;
	}

	// explicit role attribute
	role = el.getAttribute("role");
	if (role) return role;

	// implicit
	var tag = el.tagName || el.nodeName || "default";
	var desc = ROLE[tag.toLowerCase()] || ROLE["default"];
	role = desc.role;

	if (desc.type&&el.type) {
		role = desc.type[el.type] || role;
	}
	if (desc.tweak) role = desc.tweak(role,el);

	return role;
}
essential.set("effectiveRole",effectiveRole);


function roleAccessor(role) {
	return ACCESSOR[role] || ACCESSOR["default"];
}
essential.set("roleAccessor",roleAccessor);

}();
},{}],3:[function(require,module,exports){
require('./impl.js'); 
require('./form.js');

function enhance_book(el,role,config) {

	var reader = require('../bower_components/book-reader/index.js');
	var	book = new reader.Book(el,config);

	return book;
}

function layout_book(el,layout,instance) {
	if (instance) return instance.layout(layout);
}

function discard_book(el,role,instance) {
	if (instance) instance.destroy(el);
}

Resolver("page").set("handlers.enhance.book", enhance_book);
Resolver("page").set("handlers.layout.book", layout_book);
Resolver("page").set("handlers.discard.book", discard_book);

Resolver("page").set("handlers.enhance.slider", require('./slider.js').enhance);
Resolver("page").set("handlers.layout.slider", function(el,layout,instance) {
    if (instance) return instance.layout(layout);
});
Resolver("page").set("handlers.discard.slider", function(el,role,instance) {
    if (instance) instance.destroy(el);
});


if (window.angular) {

    var productApp = angular.module('productApp', [  ]); // 'toggle-switch'
    productApp.config(['$interpolateProvider', function($interpolateProvider) {
          return $interpolateProvider.startSymbol('{(').endSymbol(')}');
        }
    ]);

    productApp.controller("add-review",['$scope', function($scope) {
        $scope.device = 'off';//'iPad';
    }]);

}


},{"../bower_components/book-reader/index.js":5,"./form.js":1,"./impl.js":2,"./slider.js":4}],4:[function(require,module,exports){
!function(window) {

function Slider(el,role,config,context) {
	jQuery(el).layerSlider(config);
}
Slider.prototype.layout = function() {};
Slider.prototype.destroy = function() {};

// module: reader export
var slider = {};
if(typeof module === 'object' && typeof module.exports === 'object') {
	slider = module.exports;
}
else {
	window.slider = slider;
}

slider.enhance = function(el,role,config,context) {
    if (window.jQuery == undefined || jQuery.fn.layerSlider == undefined) return false;

    var slider = new Slider(el,role,config,context);
    return slider;
}
slider.Slider = Slider;


}(window);


},{}],5:[function(require,module,exports){
!function(window) {

/* jshint -W064: false */

var essential = Resolver("essential"),
    pageResolver = Resolver("page"),
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
	DialogAction = essential("DialogAction");

	var transEnd = {
			'WebkitTransition' : 'webkitTransitionEnd',
			'MozTransition' : 'transitionend',
			'OTransition' : 'oTransitionEnd',
			'msTransition' : 'MSTransitionEnd',
			'transition' : 'transitionend'
		}[ Modernizr.prefixed( 'transition' ) ];

	var BODY_EVENTS = {
		click: function(ev) {
			ev = MutableEvent(ev);
			var wRole = ev.target.querySelector("[role=book]")
			if (wRole) {
		        if (wRole.stateful("state.disabled")) return; // disable

		        EnhancedDescriptor.all[wRole.uniqueID].instance.click(ev);
		        ev.stopPropagation();
			}
		}
	};

	// Can this be made to work?
	var BOOK_EVENTS = {
		click: function(ev) {
			ev = MutableEvent(ev);
	        if (this.stateful("state.disabled")) return; // disable

	        EnhancedDescriptor.all[this.uniqueID].instance.click(ev);
	        ev.stopPropagation();
		}
	};

	BOOK_EVENTS[ transEnd ] = function(ev) {

        EnhancedDescriptor.all[this.uniqueID].instance.transEnd(ev);
		//TODO
	};

var expandedBook;

function Book(el,config) {
	this.el = el;
    this.stateful = el.stateful;
    this.pos = config.pos;
    this.dest = config.dest;
    if (this.dest) {
	    this.home = el.ownerDocument.querySelector(this.dest);
    }
    else {
    	for(var _el = el; _el; _el = _el.parentNode) {
    		if (_el.nodeType == 1 && _el.className.indexOf("bookspread") >= 0) this.home = _el;
    	}
    }

    // var img = el.getElementsByTagName("img")[0];
    // if (img) img.style.width = "100%"

    this.stateful.set("map.class.state.flipped","state-flipped");
    this.stateful.set("state.flipped",false);
    this.stateful.set("map.class.state.expanding","state-expanding");
    this.stateful.set("state.expanding",false);
    this.stateful.set("map.class.state.collapsing","state-collapsing");
    this.stateful.set("state.collapsing",false);
    this.stateful.set("map.class.state.collapsed","state-collapsed");
    this.stateful.set("state.collapsed",true);

    this.stateful.set("map.class.state.reading","state-reading");
    this.stateful.set("state.reading",false);

	this.prefix = config.prefix;

	this.type = "plain";
	if (config.feature) this.type = "feature";
	else if (config.spread) this.type = "spread";

	this.el.classList.add("bk-origin");
	//TODO IE11 review
	this.el.classList.add(this.type + "-book");

	addEventListeners(this.el,BOOK_EVENTS);

	this._makeReaderBook();

    return;

    var ac = ApplicationConfig();
    var page = ac.loadPage(config.src,false,function(ev) { 
    	this.book.pageLoad({page:this,book:this.book}); 
    }); //TODO ,false,this,this.pageLoad pass data,page in (event)
	page.book = this;

}

Book.prototype.destroy = function() {
	this.bookEl = null;
	this.pageEl = null;
	this.readerBookEl = null;
};

Book.prototype._makeReaderBook = function() {
	this.ensureOpenBookSupport();

	this._createReaderElement();
};

Book.prototype._createReaderElement = function() {

	this.readerBookEl = HTMLElement("div",{
		"class":"bk-book","make stateful":true
	},'<div class="bk-promo"></div>');
	this.readerBookEl.stateful.set("state.hidden",true);

	var promo = this.el.querySelector(".bk-promo");
	if (promo) {
		for(var i=0,c; c = promo.childNodes[i]; ++i) if (c.nodeType == 1) {
			this.readerBookEl.firstChild.appendChild(c);
		}
	}
	// copy article information when loaded page
	// for(var i=0,c; c = article.childNodes[i]; ++i) if (c.nodeType == 1) {
	// 	this.readerBookEl.appendChild(c);
	// }

	this.reader.appendChild(this.readerBookEl);
};


Book.prototype.pageLoad = function(ev) {
	var bindingClass = "bk-book";
	bindingClass += " " + this.type + "-type";

	if (this.prefix) bindingClass += " " + this.prefix + "-book";

	if (this.pos && this.pos < 0) bindingClass += " left-" + (-this.pos);
	if (this.pos && this.pos > 0) bindingClass += " right-" + this.pos;

	var page = ev.page, book = ev.book,
		header = ev.page.body.querySelector("body > header"),
		footer = ev.page.body.querySelector("body > footer"),
		title = ev.page.head.querySelector("title"),
		author = ev.page.head.querySelector("meta[name=author]");
		bookEl = this.bookEl = HTMLElement("div",{"class": bindingClass});

	// front used in all cases
	if (header) {
		var frontEl = HTMLElement("div",{"class":"bk-front","append to":bookEl},
			'<div class="bk-cover">','</div>',
			'<div class="bk-cover-back">','</div>');

		for(var i=0,c; c = header.childNodes[i]; ++i) if (c.nodeType == 1) {
			frontEl.firstChild.appendChild(c)
		}		
	}
	else this.warning = "No cover"; //TODO fallback behave?

	if (footer) {
		var backEl = HTMLElement("div",{"class":"bk-back","append to":bookEl});

		for(var i=0,c; c = footer.childNodes[i]; ++i) if (c.nodeType == 1) {
			backEl.appendChild(c)
		}		
	}

	this.pageEl = HTMLElement("div",{"class":"bk-page", "append to":bookEl });
	//TODO render template with overview

	if (this.type == "spread") {
		var backTwoEl = HTMLElement("div",{"class":"bk-back-two"});
		//TODO content on the inside back
		bookEl.appendChild( backTwoEl );
	}
	else {
		bookEl.appendChild( HTMLElement("div",{"class":"bk-top"}) );
		bookEl.appendChild( HTMLElement("div",{"class":"bk-bottom"}) );
		bookEl.appendChild( HTMLElement("div",{"class":"bk-right"}) );
		HTMLElement("div",{"class":"bk-left", "append to":bookEl},"<h2>",
			"<span>", title? title.firstChild.nodeValue.split("|")[0] : "", "</span>",
			"<span>", author? author.getAttribute("content") : "", "</span>",
			"</h2>" );
	}

	this.home.appendChild(bookEl);
	// ev.book.transformBase = this.bookEl.style[this.prefixedTransform] || this.bookEl.style.transform;
};

var openBook = {

};

Book.prototype.startOpen = function() {

	this.showReaderBook();

	this.stateful.set("state.collapsed",false);
	this.stateful.set("state.expanding",true); 
	this.stateful.set("state.collapsing",false);

	// var marginTop = parseInt(this.article.style.marginTop);
	// openBook.scrollY = window.scrollY;
	// openBook.marginTop = marginTop;
	// this.article.style.marginTop = (marginTop - openBook.scrollY) + "px";
	// window.scrollTo(0,0);
	pageResolver.set("state.open-book",true);
	this.reader.stateful.set("state.hidden",false);

	var eb = EnhancedDescriptor.all[expandedBook];
	if (eb) {
		eb.stateful.set("state.expanded",false);
	}
};

Book.prototype.finishOpen = function() {

	this.stateful.set("state.expanded",true);
	this.stateful.set("state.expanding",false);
	this.el.style.zIndex = "100";
	expandedBook = this.el.uniqueID;
};

Book.prototype.startClose = function() {

	this.stateful.set("state.expanded",false);
	this.stateful.set("state.expanding",false);
	this.stateful.set("state.collapsing",true);
	this.browsing = "closing";
};

Book.prototype.finishClose = function() {

	this.stateful.set("state.expanded",false);
	this.stateful.set("state.collapsing",false);
	this.stateful.set("state.collapsed",true);
	//TODO $parent.css( 'z-index', $parent.data( 'stackval' ) );
	this.el.style.zIndex = "";
	expandedBook = 0;

	pageResolver.set("state.open-book",false);
	this.reader.stateful.set("state.hidden",true);
	// this.article.style.marginTop = openBook.marginTop+"px"; //TODO tie with dynamic code
	// window.scrollTo(0,openBook.scrollY);

	this.hideContent();
};

Book.prototype.click = function(ev) {

	// if (ev.target == this.pageEl) {
	// 	this.showReaderBook();
	// 	return;
	// }

	// console.log(this.el,this.bookEl.getBoundingClientRect());

	if (this.stateful("state.expanded") || this.stateful("state.expanding")) {
		this.startClose();

	} else {
		this.startOpen();

		//TODO current = 0;
		//TODO $content.removeClass( 'bk-content-current' ).eq( current ).addClass( 'bk-content-current' );
	}
};

Book.prototype.transEnd = function(ev) {

	if (this.stateful("state.collapsing")) {
		this.finishClose();
		return;
	}

	if (this.stateful("state.expanding")) {
		this.finishOpen();
		return;
	}
};

Book.prototype.showReaderBook = function() {
	// var placement = ElementPlacement(this.pageEl);
	var rect = this.el.getBoundingClientRect()
	this.readerBookEl.style.left = rect.left + "px";
	// this.readerBookEl.style.right = (this.pageEl.offsetLeft+this.pageEl.offsetWidth) + "px";
	this.readerBookEl.style.top = rect.top + "px";
	// this.readerBookEl.style.bottom = (this.pageEl.offsetTop+this.pageEl.offsetHeight) + "px";

	this.readerBookEl.stateful.set("state.hidden",false);
	this.reader.stateful.set("state.hidden",false);
};

Book.prototype.hideContent = function() {

	this.readerBookEl.stateful.set("state.hidden",true);
	this.reader.stateful.set("state.hidden",true);
};

Book.prototype.prefixedTransform = Modernizr.prefixed("transform");

Book.prototype.layout = function(layout) {
	var width = this.el.offsetParent.offsetWidth,
		left = this.el.offsetLeft;

	// increasing z index up to middle then decreasing

	if (this.pos) {
		this.el.style.zIndex = String(10 - Math.abs(this.pos));
	}
};

Book.prototype.ensureOpenBookSupport = function () {
	if (this.bookSupported) return;

	pageResolver.set("map.class.state.open-book","open-book");
	pageResolver.set("state.open-book",false);
	pageResolver.on("true","state.open-book",this,function(ev) {
		//TODO animated move there by shifting to positioning
		// when resetting switch back to scroll offset
	});
	Book.prototype.bookSupported = true;

	addEventListeners(document.body,BODY_EVENTS);

	// set up reader if not there
	if (this.reader == undefined) {
		var r = Book.prototype.reader = HTMLElement("div",{
			"append to": document.body,
			"id":"book-reader",
			"make stateful":true});
		r.stateful.set("state.hidden",true);
	}

};

Book.prototype.bookSupported = false;
Book.prototype.reader = undefined;


// module: reader export
var reader = {};
if(typeof module === 'object' && typeof module.exports === 'object') {
	reader = module.exports;
}
else {
	window.reader = reader;
}
reader.Book = Book;


}(this);


},{}]},{},[3]);