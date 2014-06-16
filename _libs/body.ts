/// <reference path="../../HTML-Widgets/DefinitelyTyped/essentialjs/essential.d.ts"/>
/// <reference path="../../HTML-Widgets/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="../../HTML-Widgets/DefinitelyTyped/angularjs/angular.d.ts"/>

/// <reference path="head.d.ts"/>
/// <reference path="../../book-reader/fluent-app-def.ts"/>
// in head:  <reference path="resolved.ts"/>
/// <reference path="impl.ts"/>
/// <reference path="form.ts"/>
/// <reference path="router.ts"/>
/// <reference path="../../book-reader/cards.ts"/>
/// <reference path="../../book-reader/account.ts"/>
/// <reference path="../../book-reader/reader.ts"/>
/// <reference path="../../book-reader/slider.ts"/>

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

    var fluentApp = angular.module('fluentApp', [ "fluentAccount" ]);
    fluentApp.config(['$interpolateProvider', function($interpolateProvider) {
          return $interpolateProvider.startSymbol('{(').endSymbol(')}');
        }
    ]);

    fluentApp.run(['$templateCache', '$http', function($templateCache,$http) {
        // $http.get('/partials/signup.html', { cache: $templateCache });
    }]);

    fluentApp.controller("add-review",['$scope', function($scope) {
        $scope.device = 'off';//'iPad';
    }]);

    fluentApp.directive('fgChoices',['$compile',function($compile) {

        var radios = '<label class="" ng-repeat="option in __.options">'+
            '<input type="radio" name="{{ __.name }}" value="{{ option.value }}">{{ option.text }}</label>';

        function link(scope, jqElement, attrs) {
            // debugger;

            var out, langContext = attrs.langContext, __ = {
                name: attrs.name,
                options: []
            };
            scope.__ = __;
            for(var e,i=0; e = jqElement[0][i]; ++i) {
                // option
                __.options.push({
                    value: e.value || '',
                    text: e.label || e.innerHTML || ''
                });
            }

            switch(attrs.fgChoices) {
                case "radio":
                case "radios":
                    out = $compile(angular.element(radios))(scope);
                    break;
            }
            scope.__ = undefined;

            jqElement.replaceWith(out);
        }

        return {
            scope: {
                langContext: "="
            },
            // controller: function($scope) {

            // },
            link:link
        };
    }]);

    fluentApp.directive('fgStep', $FgStepDirective);

    fluentApp.directive('fgCard', $FgCardDirective);

}

document.essential.router.manage({ href:"/log-out" },"essential.resources",function(ev) {
    Resolver("document").set("essential.state.authenticated",false);
    Resolver("page").set("state.expanded",false);
    // BookAccess().forgetUser();
    //TODO reset signup form

    return false;
});

