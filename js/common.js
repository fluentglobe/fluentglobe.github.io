(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// require('../bower_components/angular-route/angular-route.js');
// require('../bower_components/angular-toggle-switch/angular-toggle-switch.min.js');

// var books = require('../bower_components/book-reader/controllers.js');

!function() {
	var HTMLElement = Resolver("essential::HTMLElement::"),
    	reader = require('../bower_components/book-reader/index.js');

//TODO http://stackoverflow.com/questions/16677528/location-switching-between-html5-and-hashbang-mode-link-rewriting


function enhance_book(el,role,config) {
	// reader.ensureOpenBookSupport();
	var book = new reader.Book(el,config);
	return book;
}

function layout_book(el,layout,instance) {
	return instance.layout(layout);
}

function discard_book(el,role,instance) {
	if (instance) instance.destroy(el);
}

Resolver("page").set("handlers.enhance.book", enhance_book);
Resolver("page").set("handlers.layout.book", layout_book);
Resolver("page").set("handlers.discard.book", discard_book);


}();

},{"../bower_components/book-reader/index.js":2}],2:[function(require,module,exports){
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


},{}]},{},[1]);