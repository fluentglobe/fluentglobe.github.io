/// <reference path="../../HTML-Widgets/DefinitelyTyped/essentialjs/essential.d.ts"/>
/// <reference path="../../HTML-Widgets/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="../../HTML-Widgets/DefinitelyTyped/angularjs/angular.d.ts"/>

/// <reference path="head.d.ts"/>
/// <reference path="../components/book-reader/fluent-app-def.ts"/>
// in head:  <reference path="resolved.ts"/>
/// <reference path="impl.ts"/>
/// <reference path="form.ts"/>
/// <reference path="router.ts"/>
/// <reference path="../components/book-reader/account.ts"/>
/// <reference path="../components/book-reader/survey.ts"/>
/// <reference path="../components/book-reader/reader.ts"/>
/// <reference path="../components/book-reader/slider.ts"/>

function enhance_book(el,role,config) {

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

Resolver("page").set("handlers.enhance.slider", slider.enhance);
Resolver("page").set("handlers.layout.slider", function(el,layout,instance) {
    if (instance) return instance.layout(layout);
});
Resolver("page").set("handlers.discard.slider", function(el,role,instance) {
    if (instance) instance.destroy(el);
});


if (window["angular"]) {

    var fluentApp = angular.module('fluentApp', [ "fluentAccount","fluentSurvey" ]);
    fluentApp.config(['$interpolateProvider', function($interpolateProvider) {
          return $interpolateProvider.startSymbol('{(').endSymbol(')}');
        }
    ]);

    fluentApp.controller("add-review",['$scope', function($scope) {
        $scope.device = 'off';//'iPad';
    }]);
}

document.essential.router.manage({ href:"/log-out" },"essential.resources",function(ev) {
    Resolver("document").set("essential.session.username","");
    Resolver("document").set("essential.session.access_token","");
    Resolver("document").set("essential.state.authenticated",false);
    Resolver("document").set("essential.state.authorised",false);
    // Resolver("page").set("state.authenticated",false);
    //TODO collapse site-menu

    return false;
});

