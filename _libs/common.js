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
