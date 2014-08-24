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

createjs.Sound.alternateExtensions = ["ogg","mp3"];

function spokenLoadHandler(event) {
    var spoken = SpokenWord.prototype.known[event.id]
    if (spoken && spoken.playOnLoad) spoken.play();
}

function SpokenWord(name:String, conf) {
    this.name = name;
    this.types = conf;
    this.known[name] = this;
} 
SpokenWord.prototype.known = {};
SpokenWord.prototype.capabilities = createjs.Sound.getCapabilities();

SpokenWord.prototype._prepareLoad = function() {
    if (this.loadHandler) return;

    SpokenWord.prototype.loadHandler = createjs.Sound.addEventListener("fileload", spokenLoadHandler);

};

SpokenWord.prototype.load = function() {
    if (this.registered) return;

    this._prepareLoad();

    //TODO resource Path
    var fileName = createjs.Sound.getCapability("ogg")? this.types.ogg : this.types.mp3,
        path = "/assets/7766449900/" + fileName;
    this.registered = createjs.Sound.registerSound(path, this.name, 1);
    /*
    if (this.el) return;

    var HTMLElement = Resolver("essential::HTMLElement::");

    var el = HTMLElement("audio");
    for(var type in this.types) {
        var fileName = this.types[type];
        switch(type) {
            case "ogg":
            case "mp3":
                HTMLElement("source",{ src: "/assets/7766449900/" + fileName, appendTo: el });
                break;
        }
    }
    this.el = el;
    document.body.appendChild(el);
    */
};

SpokenWord.prototype.unload = function() {
    if (!this.registered) return;

    // forget played instance
    this.instance = null;
    createjs.Sound.removeSound(this.name);
    // this.el.parentNode.removeChild(this.el);
    // this.el = null;
};

SpokenWord.prototype.completed = function(event) {
    //TODO play completed
};

SpokenWord.prototype.play = function() {
    if (this.instance) {
        this.instance.resume();
        return;
    }

    if (this.registered) {

        this.playOnLoad = false;
        this.instance = createjs.Sound.play(this.name);
        //TODO on complete clear instance

    } else {

        this.playOnLoad = true;
        this.load();

    }
};

SpokenWord.prototype.pause = function() {
    if (this.instance) this.instance.pause();
};

SpokenWord.prototype.stop = function() {
    if (!this.instance) return;

    this.instance.stop();
    //TODO more ?
};

SpokenWord.prototype.togglePlay = function() {
    //TODO try to test playState ??
    if (this.instance) this.play();
    else this.pause();
};



function registerSounds(map) {
    this.spokenWords = this.spokenWords || {};
    for(var n in map) {
        this.spokenWords[n] = new SpokenWord(n, map[n]);
    }
}

function hypeDocCallback(hypeDocument, element, event) {
    hypeDocument.registerSounds = registerSounds;
}

if("HYPE_eventListeners" in window === false) {
    window["HYPE_eventListeners"] = Array();
  }
  window["HYPE_eventListeners"].push({"type":"HypeDocumentLoad", "callback":hypeDocCallback});


function AssetPresentation() {

}

AssetPresentation.prototype.applyFeature = function(feature) {
    //TODO cache alternate path
    var path = "/assets/7766449900/stress-free-hype.html";
    $.ajax({
        url: path,
        data: this,
        success: function(data,status,xhr) {
            // apply body
            // apply listener
        }
    });
};

function enhance_presentation(el,role,config) {
    var presentation = new AssetPresentation();
    Resolver("buckets::user.features").on("bind change",function(ev) {
        var feature = ev.base[config.feature];
        if (feature) {
            presentation.applyFeature(feature);
        }
    });
    
    return presentation;
}

Resolver("document").set("essential.handlers.enhance.presentation", enhance_presentation);

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
                        // {"stress-free-switzerland":"123456"}
                        // eyJzdHJlc3MtZnJlZS1zd2l0emVybGFuZCI6IjEyMzQ1NiJ9
                        var decoded = JSON.parse(atob(value));
                        access.enableFeatures(decoded);
                    } catch(ex) {}
                    break;
            }
        }

        //TODO if authenticated, change user auth

        document.essential.router.clearHash();
    }
    return false;
});

