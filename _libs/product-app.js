require('./impl.js'); 
require('./form.js');
require('./router.js');

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

