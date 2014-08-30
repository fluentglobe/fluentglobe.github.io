/// <reference path="../../libs/DefinitelyTyped/essentialjs/essential.d.ts"/>
/// <reference path="../../libs/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="../../libs/DefinitelyTyped/soundjs/soundjs.d.ts"/>
/// <reference path="../../libs/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../libs/DefinitelyTyped/impress/impress.d.ts"/>

/// <reference path="head.d.ts"/>
/// <reference path="../../libs/book-reader/fluent-app-def.ts"/>
// in head:  <reference path="resolved.ts"/>
/// <reference path="impl.ts"/>
/// <reference path="form.ts"/>
/// <reference path="router.ts"/>
/// <reference path="../../libs/book-reader/cards.ts"/>
/// <reference path="../../libs/book-reader/account.ts"/>
/// <reference path="../../libs/book-reader/reader.ts"/>
/// <reference path="../../libs/book-reader/slider.ts"/>
/// <reference path="../../libs/book-reader/audio.ts"/>

/// <reference path="../../libs/immerse.js/index.ts"/>

//TODO generalise for multiple countries

Resolver("page").set("map.class.state.stress-free-feature","stress-free-feature-enabled");
Resolver("page").set("state.stress-free-feature", !!Resolver("buckets")("user.features.stress-free-switzerland","null"));

Resolver("buckets::user.features").on("change",function(ev) {
    var enabled = !!Resolver("buckets")("user.features.stress-free-switzerland","null");
    Resolver("page").set("state.stress-free-feature", enabled);
});

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

Resolver("document").set("essential.handlers.enhance.book", enhance_book);
Resolver("document").set("essential.handlers.layout.book", layout_book);
Resolver("document").set("essential.handlers.discard.book", discard_book);

Resolver("document").set("essential.handlers.enhance.slider", slider.enhance);
Resolver("document").set("essential.handlers.layout.slider", function(el,layout,instance) {
    if (instance) return instance.layout(layout);
});
Resolver("document").set("essential.handlers.discard.slider", function(el,role,instance) {
    if (instance) instance.destroy(el);
});

Resolver("document").set("essential.handlers.enhance.presentation", ProtectedPresentation["handlers"].enhance);
Resolver("document").set("essential.handlers.discard.presentation", ProtectedPresentation["handlers"].discard);

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

document.essential.router.manage({ href:"/stress-free-presentation"}, "essential.resources", function(path,action) {

    impress('stress-free-presentation').init();

    return false;
});

document.essential.router.manage({ href:"/continue-speaking" },"essential.resources",function(path,action) {

    ProtectedPresentation.continueSpeaking();
    document.essential.router.clearHash();
    return false;
});

document.essential.router.manage({ href:"/pause-speaking" },"essential.resources",function(path,action) {

    ProtectedPresentation.pauseSpeaking();
    document.essential.router.clearHash();
    return false;
});

document.essential.router.manage({ href:"/skip-speaking" },"essential.resources",function(path,action) {

    ProtectedPresentation.skipSpeaking();
    document.essential.router.clearHash();
    return false;
});

document.essential.router.manage({ href:"/log-out" },"essential.resources",function(path,action) {
    Resolver("document").set("essential.state.authenticated",false);
    Resolver("page").set("state.authenticated",false); //TODO move to new flag
    Resolver("buckets").logOut();
    Resolver("page").set("state.expanded",false); //TODO collapse the menu I'm in
    //TODO reset signup form

        document.essential.router.clearHash();

    return false;
});

document.essential.router.manage({ href:"/present_for"}, "essential.resources", function(path,action) {
    var parts = path.split("&"), present = parts[0].split("=");

    // ignore if clearing hash
    if (parts.length>1 || present.length>1) {
        // Resolver("document").set("essential.state.authenticated",false);

        Resolver("page").set("state.expanded",false);

        var access = account.BookAccess();

        for(var i=0, part; part = parts[i]; ++i) {
            var bits = part.split("="), name = bits.shift(), value = bits.join("=");
            switch(name) {
                case "/present_for":
                    if (value && value.indexOf("@") > 0) {
                        //TODO verify as email
                        access.user.email = present[1];
                        access.startSignUp();
                    } else {
                        //TODO pop up a login form
                        // save the parts
                    }
                    break;
                case "enable":
                    try {
                        // {"stress-free-switzerland":{"path":"/assets/7766449900/", "js":"sfpch_hype_generated_script.js", "id":"sfpch_hype_container", "doc":"sfp-ch"}}
                        // eyJzdHJlc3MtZnJlZS1zd2l0emVybGFuZCI6eyJwYXRoIjoiL2Fzc2V0cy83NzY2NDQ5OTAwLyIsICJqcyI6InNmcGNoX2h5cGVfZ2VuZXJhdGVkX3NjcmlwdC5qcyIsICJpZCI6InNmcGNoX2h5cGVfY29udGFpbmVyIiwgImRvYyI6InNmLXBjaCJ9fQ==
                        var decoded = JSON.parse(atob(value));
                        access.enableFeatures(decoded);
                    } catch(ex) {
                        console.error("Failed to enable features",decoded,ex);
                    }
                    break;
            }
        }

        //TODO if authenticated, change user auth

        document.essential.router.clearHash();
    }
    return false;
});

