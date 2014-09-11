var fluentbook;
(function (fluentbook) {
    var essential = Resolver("essential"), StatefulResolver = essential("StatefulResolver");

    var ROLE = {
        form: { role: "form" },
        iframe: {},
        object: {},
        a: { role: "link" },
        img: { role: "img" },
        label: { role: "note" },
        input: {
            role: "textbox",
            type: {
                range: "slider", checkbox: "checkbox", radio: "radio",
                button: "button", submit: "button", reset: "button"
            }
        },
        select: { role: "listbox" },
        button: { role: "button" },
        textarea: { role: "textbox" },
        fieldset: { role: "group" },
        progress: { role: "progressbar" },
        "default": {
            role: "default"
        }
    };

    var ACCESSOR = {
        "default": { init: defaultInit },
        form: { init: defaultInit },
        dialog: { init: defaultInit },
        alertdialog: { init: defaultInit },
        group: { init: statefulInit },
        progressbar: { init: statefulInitValue },
        listbox: { init: statefulInitValue },
        slider: { init: statefulInitValue },
        checkbox: { init: statefulInitChecked },
        radio: { init: statefulInitRadio },
        link: { init: statefulInit },
        button: { init: statefulInit },
        img: { init: defaultInit },
        note: { init: defaultInit },
        textbox: { init: statefulInitValue }
    };

    function defaultInit(role, root, node) {
    }

    function statefulInit(role, root, node) {
        var stateful = StatefulResolver(node, true);
        stateful.set("state.disabled", node.disabled);
        stateful.set("state.hidden", node.hidden);
        stateful.set("state.readOnly", node.readOnly);
    }

    function statefulInitValue(role, root, node) {
        statefulInit.call(this, role, root, node);

        var name = node.name || node.getAttribute("name") || node.getAttribute("data-name");
        if (name && root.stateful) {
            root.stateful.set(["model", name], node.value);
        }
    }
    function statefulInitChecked(role, root, node) {
        statefulInit.call(this, role, root, node);

        var name = node.name || node.getAttribute("name") || node.getAttribute("data-name");
        if (name && root.stateful) {
            root.stateful.set(["model", name], node.checked);
        }
    }
    function statefulInitRadio(role, root, node) {
        statefulInit.call(this, role, root, node);

        var name = node.name || node.getAttribute("name") || node.getAttribute("data-name");
        if (name && root.stateful) {
            if (node.checked)
                root.stateful.set(["model", name], node.value);
        }
    }

    function effectiveRole(el) {
        var role;
        if (el.stateful) {
            role = el.stateful("impl.role", "undefined");
            if (role)
                return role;
        }

        role = el.getAttribute("role");
        if (role)
            return role;

        var tag = el.tagName || el.nodeName || "default";
        var desc = ROLE[tag.toLowerCase()] || ROLE["default"];
        role = desc.role;

        if (desc.type && el.type) {
            role = desc.type[el.type] || role;
        }
        if (desc.tweak)
            role = desc.tweak(role, el);

        return role;
    }
    essential.set("effectiveRole", effectiveRole);

    function roleAccessor(role) {
        return ACCESSOR[role] || ACCESSOR["default"];
    }
    essential.set("roleAccessor", roleAccessor);
})(fluentbook || (fluentbook = {}));
var fluentbook;
(function (fluentbook) {
    var essential = Resolver("essential"), pageResolver = Resolver("page"), EnhancedDescriptor = essential("EnhancedDescriptor"), HTMLElement = essential("HTMLElement"), MutableEvent = essential("MutableEvent"), fireAction = essential("fireAction"), addEventListeners = essential("addEventListeners"), XMLHttpRequest = essential("XMLHttpRequest"), StatefulResolver = essential("StatefulResolver");

    var effectiveRole = essential("effectiveRole"), roleAccessor = essential("roleAccessor");

    if (!/PhantomJS\//.test(navigator.userAgent)) {
        Resolver("page").set("map.class.notstate.connected", "disconnected");
    }

    function updateConnected() {
        if (pageResolver("state.online") == false) {
            pageResolver.set("state.connected", false);
            setTimeout(updateConnected, 15000);
            return;
        }

        var url = "https://email.fluentglobe.com/t/i/s/pdtdj/";
        var xhr = XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function (ready) {
            if (xhr.readyState == 4) {
                if (xhr.status == 200 || xhr.status == 304) {
                    pageResolver.set("state.connected", true);
                    setTimeout(updateConnected, 30000);
                } else {
                    pageResolver.set("state.connected", false);
                    setTimeout(updateConnected, 10000);
                }
            }
        };
        xhr.send("");
    }

    var parseOptions;

    function parseURI(str) {
        var o = parseOptions, m = o.parser[o.strictMode ? "strict" : "loose"].exec(str), uri = {}, i = 14;

        while (i--)
            uri[o.key[i]] = m[i] || "";

        uri[o.q.name] = {};
        uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
            if ($1)
                uri[o.q.name][$1] = $2;
        });
        uri.toString = parseURI.toString;

        return uri;
    }
    ;

    parseOptions = parseURI['options'] = {
        strictMode: false,
        key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
        q: {
            name: "queryKey",
            parser: /(?:^|&)([^&=]*)=?([^&]*)/g
        },
        parser: {
            strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
        }
    };

    parseURI.toString = function () {
        return this.protocol + "://" + this.host + (this.port ? ":" + this.port : "") + this.path + (this.query ? "?" + this.query : "");
    };

    function buildURI(uri) {
        return parseURI.toString.call(uri);
    }

    var newIframeId = 1;

    function EnhancedForm(el, config) {
        el.onsubmit = form_onsubmit;
        el.__builtinSubmit = el.submit;
        el.submit = form_submit;
        el.__builtinBlur = el.blur;
        el.blur = form_blur;
        el.__builtinFocus = el.focus;
        el.focus = form_focus;

        this.namedElements = {};

        this.stateful = el.stateful;
        this.stateful.set("map.class.state.subscribed", "state-subscribed");
        this.stateful.set("state.subscribed", false);

        this.inIframeSubmit = false;

        var strategyRole = el.stateful("strategy.role", "undefined") || effectiveRole;
        for (var i = 0, node; node = el.elements[i]; ++i) {
            if (node.accessor == undefined) {
                var role = strategyRole(node);
                var accessor = roleAccessor(role);
                accessor.init(role, el, node);
                node.accessor = accessor;

                var name = node.getAttribute("name");
                if (name) {
                    this.namedElements[name] = node;
                    node.originalName = name;
                }
            }

            if (node.tagName == "BUTTON" && node.getAttribute("role") == null) {
                node.setAttribute("role", "button");
            }
        }

        addEventListeners(el, {
            "change": form_input_change,
            "click": dialog_button_click
        }, false);

        this.actionParts = parseURI(el.action);

        var enctype = el.getAttribute("enctype");

        switch (enctype) {
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

        this.showSubmitResult = config.showSubmitResult;

        this.actions = config.actions;
        if (config.defaultAction) {
            this.applyAction(el, config.defaultAction);
        }
    }

    EnhancedForm.prototype.destroy = function (el) {
        this.namedElements = null;
    };

    EnhancedForm.prototype.applyAction = function (el, logicName) {
        var logic = this.actions[logicName];
        if (logic) {
            for (var n in logic.mapName) {
                if (this.namedElements[n])
                    this.namedElements[n].setAttribute("name", logic.mapName[n]);
            }
            this.actionParts.path = logic.path;
        }
    };

    EnhancedForm.prototype.submit = function (el) {
    };

    EnhancedForm.prototype.planJsonSubmit = function (el) {
        this.submit = this.jsonSubmit;
    };

    EnhancedForm.prototype.jsonSubmit = function (ev, el) {
        var method = "POST";
        var actionVariant = ev.actionElement.actionVariant;
        actionVariant.uri = parseURI(this.action);
        if (actionVariant.uri.protocol == "client+http")
            actionVariant.uri.protocol = "http";
        if (actionVariant.uri.protocol == "client+https")
            actionVariant.uri.protocol = "https";
        if (actionVariant.host)
            actionVariant.uri.host = actionVariant.host;

        var enctype = el.getAttribute("enctype");
        var xhr = new XMLHttpRequest();
        xhr.open(method, actionVariant.uri.toString(), true);

        xhr.setRequestHeader("Content-Type", enctype + "; charset=utf-8");
        xhr.onreadystatechange = function (ready) {
            if (xhr.readyState == 4) {
                if (xhr.status == 200 || xhr.status == 304) {
                    if (actionVariant.onsuccess)
                        actionVariant.onsuccess(ready);
                } else {
                    if (actionVariant.onerror)
                        actionVariant.onerror(ready);
                }
            }
        };

        var data = this.stateful("model");
        var string = JSON.stringify(data);
        xhr.send(string);
        ev.preventDefault();
    };

    EnhancedForm.prototype.onIframeLoad = function (ev) {
        ev = MutableEvent(ev);

        if (this.inIframeSubmit) {
            if (this.showSubmitResult) {
                ev.target.stateful.set("state.hidden", false);
            }
            this.stateful.set("state.subscribed", true);

            this.inIframeSubmit = false;
        }
    };

    EnhancedForm.prototype.planIframeSubmit = function (el) {
        this.iframeId = el.target || "form-target-" + (newIframeId++);
        var eFrame = document[this.iframeId] ? document[this.iframeId].frameElement : document.getElementById(this.iframeId);

        if (eFrame == null) {
            this.targetIframe = HTMLElement("iframe", {
                "id": this.iframeId, "name": this.iframeId,
                "frameborder": "0", "border": "0",
                "make stateful": true,
                "append to": el
            });
        } else {
            this.targetIframe = eFrame;
            StatefulResolver(eFrame, true);
        }
        this.targetIframe.stateful.set("state.hidden", true);
        this.targetIframe.onload = this.onIframeLoad.bind(this);

        el.target = this.iframeId;
        this.actionParts.protocol = this.actionParts.protocol.replace("client+http", "http");
        this.submit = this.iframeSubmit;
    };

    EnhancedForm.prototype.iframeSubmit = function (ev, el) {
        this.inIframeSubmit = true;
        var action = buildURI(this.actionParts);
        el.setAttribute("action", action);
        el.__builtinSubmit();
    };

    function form_blur() {
        for (var i = 0, e; (e = this.elements[i]); ++i) {
            e.blur();
        }
    }
    function form_focus() {
        for (var i = 0, e; (e = this.elements[i]); ++i) {
            var autofocus = e.getAttribute("autofocus");
            if (!autofocus)
                continue;
            e.focus();
            break;
        }
    }

    function form_onsubmit(ev) {
        var frm = this;
        setTimeout(function () {
            frm.submit(ev);
        }, 0);
        return false;
    }

    function form_do_submit(ev) {
        var desc = EnhancedDescriptor(this);
        desc.instance.submit(ev, this);
    }

    function form_submit(ev) {
        if (document.activeElement) {
            document.activeElement.blur();
        }
        this.blur();

        if (ev && ev.success) {
        }
        dialog_submit.call(this, ev);
    }

    function dialog_submit(clicked) {
        if (clicked == undefined) {
            clicked = MutableEvent().withDefaultSubmit(this);
        }

        if (clicked.commandElement && clicked.commandName) {
            fireAction(clicked);
        } else if (clicked.actionElement) {
            var actionDesc = EnhancedDescriptor(clicked.actionElement);
            if (actionDesc && actionDesc.instance)
                actionDesc.instance.submit(clicked, clicked.actionElement);
        }
    }

    function form_input_change(ev) {
        ev = MutableEvent(ev);

        switch (ev.target.type) {
            case "checkbox":
                this.stateful.set(["model", ev.target.name], ev.target.checked);
                break;
            case "radio":

            default:
                this.stateful.set(["model", ev.target.name], ev.target.value);
                break;
        }
    }

    function dialog_button_click(ev) {
        ev = MutableEvent(ev).withActionInfo();

        if (ev.commandElement) {
            if (ev.stateful && ev.stateful("state.disabled"))
                return;
            if (ev.ariaDisabled)
                return;

            this.submit(ev);
            ev.stopPropagation();

            if (!ev.defaultPrevented && ev.commandElement.type == "submit")
                form_do_submit.call(this, ev);
        }
        if (ev.defaultPrevented)
            return false;
    }

    function applyDefaultRole(elements) {
        for (var i = 0, el; (el = elements[i]); ++i) {
            var stateful = StatefulResolver(el, true);
            stateful.set("state.disabled", el.disabled);
            stateful.set("state.hidden", el.hidden);
            stateful.set("state.readOnly", el.readOnly);

            switch (el.tagName) {
                case "button":
                case "BUTTON":
                    el.setAttribute("role", "button");
                    break;
                case "a":
                case "A":
                    el.setAttribute("role", "link");
                    break;
            }
        }
    }

    function enhance_form(el, role, config) {
        var clientType = (el.action.substring(0, 12) == "client+http:") || (el.action.substring(0, 13) == "client+https:");

        if (clientType) {
            return new EnhancedForm(el, config);
        }
    }

    function layout_form(el, layout, instance) {
    }

    function discard_form(el, role, instance) {
        if (instance)
            instance.destroy(el);
    }

    Resolver("page").declare("handlers.enhance.form", enhance_form);
    Resolver("page").declare("handlers.layout.form", layout_form);
    Resolver("page").declare("handlers.discard.form", discard_form);
})(fluentbook || (fluentbook = {}));
var fluentglobe;
(function (fluentglobe) {
    var global = Resolver(), essential = Resolver("essential"), addEventListeners = essential("addEventListeners"), MutableEvent = essential("MutableEvent"), essentialRef = Resolver("document::essential"), proxyConsole = essential("console")(), StatefulResolver = essential("StatefulResolver"), DialogAction = essential("DialogAction");

    var baseUrl = location.href.substring(0, location.href.lastIndexOf("/") + 1);

    Resolver.method("copyToScope", function (scope, names, adjuster) {
        var v = {};
        for (var n in names) {
            v[n] = this.get(n);
        }
        if (adjuster)
            adjuster(v, 'to scope');
        for (var n in names) {
            scope[names[n]] = v[n];
        }
    });

    Resolver.method("intoAngularScope", function (scope, names, adjuster) {
        this.copyToScope(scope, names, adjuster);

        this.on("change", this, function (ev) {
            ev.data.copyToScope(scope, names, adjuster);
            if (scope.$safeDigest)
                scope.$safeDigest();
            else
                scope.$digest();
        });
    });

    function RouterPath(href, resources, fn) {
        this.href = href.toLowerCase();
        this.resources = resources;
        this.fn = fn;
        this.els = [];
    }

    RouterPath.prototype.registerEl = function (el, href) {
        for (var i = 0, l = this.els.length; i < l; ++i)
            if (this.els[i] == el)
                return;

        if (href.indexOf(this.href.toLowerCase()) == 0) {
            this.els.push(el);
            var stateful = StatefulResolver(el, true);
            stateful.declare("map.class.state.disabled", "state-disabled");
        }
    };

    RouterPath.prototype.updateEls = function (resource) {
        for (var i = 0, l = this.els.length; i < l; ++i) {
            this.els[i].stateful.set("state.disabled", !resource.available);
        }
    };

    function Router() {
        this.hrefs = [];
        this.resourcesOn = {};
        this.hashDriven = [];

        addEventListeners(window, {
            hashchange: this.hashchange.bind(this)
        });
    }
    Router.prototype.setRoot = function (r) {
        this.root = r.toLowerCase();
    };

    Router.prototype.manage = function (match, resources, fn) {
        if (match.href) {
            if (typeof match.href == "string")
                this.hrefs.push(new RouterPath(match.href, resources, fn));
            else
                for (var i = 0, h; h = match.href[i]; ++i)
                    this.hrefs.push(new RouterPath(h, resources, fn));
        }

        this.manageDOM(document);

        if (this.resourcesOn[resources] == undefined) {
            this.resourcesOn[resources] = true;
            Resolver("document").on("change", resources, this, this._onResources);
            var map = Resolver("document")(resources);

            for (var n in map) {
                Resolver("document").reference(resources + "." + n).trigger("change");
            }
        }
    };

    Router.prototype.manageDOM = function (doc) {
        var anchors = doc.documentElement.getElementsByTagName("A");
        var origin = window.location.protocol + "//" + window.location.hostname;
        if (window.location.port)
            origin += ":" + window.location.port;

        for (var i = 0, a; a = anchors[i]; ++i) {
            var ahref = a.href;
            if (ahref.indexOf(origin) == 0)
                ahref = ahref.substring(origin.length);
            if (ahref.indexOf(this.root) == 0)
                ahref = ahref.substring(this.root.length);

            for (var j = 0, href; href = this.hrefs[j]; ++j)
                if (a.href)
                    href.registerEl(a, ahref);
        }
    };

    Router.prototype._onResources = function (ev) {
        var router = ev.data;

        for (var j = 0, path; path = router.hrefs[j]; ++j)
            if (path.href == ev.symbol) {
                path.updateEls(ev.base[ev.symbol]);
            }
    };

    Router.prototype.onAnchorClick = function (href, attributes) {
        var origin = window.location.protocol + "//" + window.location.hostname;
        if (window.location.port)
            origin += ":" + window.location.port;
        if (href.indexOf(origin) == 0)
            href = href.substring(origin.length);
        if (href.indexOf(this.root) == 0)
            href = href.substring(this.root.length);

        if (this.player && attributes['rel'] && attributes['rel'].value == "audio" && (href.indexOf('.mp3') >= 0 || href.indexOf('.m4a') >= 0 || href.indexOf('.mp4') >= 0 || href.indexOf('.wav') >= 0)) {
            this.player.setSrc(href);

            this.player.play();
            return false;
        }

        for (var i = 0, path; path = this.hrefs[i]; ++i) {
            if (href.indexOf(path.href) == 0) {
                try  {
                    var prevent = path.fn(href, "open");
                    if (prevent == false)
                        return false;
                } catch (ex) {
                    debugger;
                }
            }
        }
    };

    Router.prototype.requireHash = function (el, config) {
        StatefulResolver(el, true);
        this.hashDriven.push(el, config);
        this._hideIfNotHash(el, config);
    };

    Router.prototype.setHash = function (name) {
        location.hash = "#" + name;
        this.hashchange();
    };

    Router.prototype.hashchange = function (ev) {
        for (var i = 0, l = this.hashDriven.length; i < l; i += 2) {
            var el = this.hashDriven[i], config = this.hashDriven[i + 1];
            this._hideIfNotHash(el, config);
        }
        this.hashCall(location.hash);
    };

    Router.prototype._hideIfNotHash = function (el, config) {
        var id = el.id, hash = location.hash.replace("#", "");
        if (typeof config["require-hash"] == "string")
            id = config["require-hash"];
        el.stateful.set("state.hidden", id !== hash);
    };

    Router.prototype.linkPlayButtons = function () {
        if (window['mejs']) {
            var mediaelement = window['mejs'].$("#page-audio").mediaelementplayer({
                audioWidth: 100,
                features: ['playpause', 'progress']
            });
            if (mediaelement.length) {
                var mep = document.getElementById(mediaelement.data().mediaelementplayer.id);
                mep.className += " page-audio";
                this.player = mediaelement[0].player;
            }
        }
    };

    Router.prototype.hashCall = function (hash) {
        if (hash) {
            for (var i = 0, path; path = this.hrefs[i]; ++i) {
                if (hash.indexOf(path.href) == 1) {
                    try  {
                        var prevent = path.fn(hash.substring(1), "load");
                        if (prevent == false)
                            return false;
                    } catch (ex) {
                        debugger;
                    }
                }
            }
        }
    };

    Router.prototype.clearHash = function (clearAll) {
        if (clearAll === false) {
            var hash = location.hash.split("=")[0].split("&")[0];
            location.hash = hash;
        } else if (typeof clearAll == "string") {
            location.hash = clearAll;
        } else {
            location.hash = "";
        }
    };

    addEventListeners(document.documentElement, {
        "click": function (ev) {
            ev = MutableEvent(ev).withActionInfo();
            var router = essentialRef("router");
            if (ev.commandElement && ev.commandElement.href) {
                var stateful = StatefulResolver(ev.commandElement);
                if (stateful("state.disabled")) {
                    ev.preventDefault();
                    return;
                }
                if (false == router.onAnchorClick(ev.commandElement.href, ev.commandElement.attributes))
                    ev.preventDefault();
            }
        }
    });

    Resolver("document").elementsWithConfig = function () {
        var els = document.querySelectorAll("[data-role]"), config = document.essential.config;

        for (var n in config) {
            var el = document.getElementById(n);
            if (el)
                els[els.length] = el;
        }

        return els;
    };

    Resolver("document").on("change", "readyState", function (ev) {
        if (ev.value == "complete") {
            document.essential.router.linkPlayButtons();

            var els = Resolver("document").elementsWithConfig();
            for (var i = 0, el; el = els[i]; ++i) {
                var config = Resolver.config(el);
                if (config["require-hash"])
                    document.essential.router.requireHash(el, config);
            }

            var router = document.essential.router, hash = location.hash;

            router.hashCall(hash);
        }
    });

    essentialRef.declare("router", new Router());
})(fluentglobe || (fluentglobe = {}));
var $FgStepDirective = [
    '$animate', function ($animate) {
        function modelsIn(elq, prefix) {
            var withModels = elq.find("[ng-model]"), names = {}, r = [];
            for (var i = 0, input; input = withModels[i]; ++i) {
                var m = input.getAttribute("ng-model"), k;
                switch (input.type) {
                    case "radio":
                        if (m.indexOf(prefix + ".") == 0)
                            k = m.substring(prefix.length + 1);
                        if (k)
                            names[k] = true;
                        break;
                }
            }
            for (var n in names)
                r.push(n);

            return r;
        }

        function link(scope, elq, attrs) {
            var thisStep = scope.steps[attrs.fgStep], thisName = attrs.fgStep, nextStep = attrs.nextStep, notIf = attrs.notIf, results = attrs.results || "results";
            if (thisStep == undefined)
                scope.steps[attrs.fgStep] = thisStep = { name: attrs.fgStep };
            thisStep.results = results;
            if (scope[results] === undefined)
                scope[results] = {};
            thisStep.models = modelsIn(elq, results);
            if (nextStep)
                thisStep.nextStep = nextStep;
            if (notIf)
                thisStep.notIf = notIf;
            var valueStep = thisStep.valueStep = [];

            var options = elq.find('[next-step]');
            for (var i = 0, o; o = options[i]; ++i) {
                var ns = o.getAttribute("next-step"), v = o.value, model = o.getAttribute("ng-model");
                switch (o.type) {
                    case "radio":
                        valueStep.push({ name: (o.name || o.getAttribute("name")), value: v, next: ns, model: model });
                        break;
                }
            }

            if (scope.firstStep == undefined)
                scope.firstStep = attrs.fgStep;
            scope.$watch('currentStep', function fgStepShowStep(value) {
                $animate[value == thisName ? 'removeClass' : 'addClass'](elq, 'ng-hide');
            });
        }

        return {
            link: link
        };
    }];

var $FgCardDirective = [
    '$compile', '$http', '$templateCache', 'Access', '$bucketsResolver', function ($compile, $http, $templateCache, Access, $bucketsResolver) {
        function getTemplate(type) {
            var templateLoader, baseUrl = "/partials/";
            var templateUrl = baseUrl + type + ".html";
            templateLoader = $http.get(templateUrl, { cache: $templateCache });

            return templateLoader;
        }

        function link(scope, jqElement, attrs) {
            scope.$safeDigest = function () {
                switch (this.$root.$$phase) {
                    case "$apply":
                    case "$digest":
                        break;
                    default:
                        this.$digest();
                }
            };

            scope.steps = {};
            scope.Access = Access;
            if (attrs.bucket) {
                scope.bucketName = attrs.bucket;
            }

            scope.allowNext = false;
            scope.currentStep = null;

            var resultsWatch;

            function resultsChanged(results, old) {
                scope.allowNext = true;
                var step = scope.steps[scope.currentStep];
                if (step && results) {
                    for (var i = 0, n; n = step.models[i]; ++i) {
                        if (results[n] === undefined)
                            scope.allowNext = false;
                    }
                }
            }

            scope.nextStep = function (explicit) {
                var cur = (scope.currentStep == undefined) ? null : scope.steps[scope.currentStep], nextStep = cur == null ? scope.firstStep : cur.nextStep, bucket = scope.bucketName ? Resolver("buckets").getBucket(scope.bucketName) : null, ok = true;

                if (explicit)
                    nextStep = scope.steps[explicit] ? explicit : nextStep;

                if (cur && bucket) {
                    Resolver("buckets").declare([scope.bucketName, cur.results], {});
                    Resolver("buckets").reference([scope.bucketName, cur.results]).mixin(scope[cur.results]);
                    bucket.update(cur.results);
                }

                do {
                    scope.currentStep = nextStep;

                    if (cur) {
                        for (var i = 0, vs; vs = cur.valueStep[i]; ++i)
                            if (vs.value == scope.$eval(vs.model))
                                scope.currentStep = vs.next;
                    }

                    var step = scope.steps[scope.currentStep];
                    if (step) {
                        if (step.notIf) {
                            ok = !scope.$eval(step.notIf);
                        } else
                            ok = true;

                        nextStep = step.nextStep;
                        cur = step;
                    }
                } while(nextStep && !ok);

                if (resultsWatch)
                    resultsWatch();
                if (step) {
                    resultsWatch = scope.$watchCollection(step.results, resultsChanged);
                }
            };

            var loader = getTemplate(scope.name);
            var promise = loader.success(function (html) {
                jqElement.html(html);
            }).then(function (response) {
                jqElement.replaceWith($compile(jqElement.html())(scope));
                var results = {};
                for (var n in scope.steps) {
                    var step = scope.steps[n];
                    if (step.results)
                        results[step.results] = true;
                }
                scope.resultsList = [];
                for (var n in results)
                    scope.resultsList.push(n);

                if (scope.bucketName) {
                    for (var i = 0, r; r = scope.resultsList[i]; ++i) {
                        var ref = Resolver("buckets").reference([scope.bucketName, r].join("."));
                        ref.on("bind change", function (ev) {
                            scope[ev.symbol] = ev.resolver(ev.selector);
                            scope.$safeDigest();
                        });
                    }
                    Resolver("buckets").getBucket(attrs.bucket, function (name, bucket) {
                        scope.$safeDigest();
                    });
                }
                scope.nextStep();
            });
        }
        return {
            scope: {
                "iLiveIn": "&",
                "class": "@",
                name: "@"
            },
            link: link
        };
    }];
var account;
(function (account) {
    Resolver.angularProvider = function (namespace, module, providerName) {
        var resolver = Resolver.bind(null, namespace);

        module.provider(providerName, function ResolverProvider() {
            this.$get = [resolver];
        });
    };

    var buckets = Resolver("buckets");
    buckets.getSimperium = function () {
        if (this.simperium == undefined) {
            var access_token = session('access_token'), username = session().username;
            if (!access_token || !username)
                return null;
            this.simperium = new Simperium(this.app_id, { token: access_token, username: username });
        }
        return this.simperium;
    };

    buckets.stopSimperium = function () {
        if (this.simperium)
            this.simperium.stop();
    };

    buckets.startSimperium = function () {
        if (this.simperium)
            this.simperium.start();
    };

    buckets.stop = function () {
        if (this.simperium) {
            this.simperium.stop();
            this.simperium = null;
        }
    };

    buckets.hasReadyUserBucket = function () {
        var bn = name + "Bucket", bucket = this.get(bn, "null");
        if (bucket == null)
            return false;
        return bucket.initialized;
    };

    buckets.getBucket = function (name, onReady) {
        var bn = name + "Bucket", simperium = this.getSimperium();

        this.declare(name, {});
        if (simperium == null)
            return null;

        if (this.get(bn, "null") == null) {
            var bucket = this.set(bn, simperium.bucket(name));
            bucket.on('notify_init', function (id, data) {
                console.info("init bucket", name, "with", id, "=", data);

                if (buckets(name) == null)
                    buckets.set(name, {});
                buckets.set([name, id], data);
            });
            bucket.on('notify', function (id, data) {
                buckets.set([name, id], data);
            });
            bucket.on('local', function (id) {
                return buckets([name, id], "null");
            });
            bucket.on('error', function (errortype) {
                if (errortype == "auth") {
                    Resolver("document").set("essential.session.access_token", null);

                    if (session("username"))
                        buckets.authenticate(session("username"), buckets.lastPassword || '-', this, {});
                    return;
                }

                console.log("got error:", errortype);
            });
            bucket.on('ready', function () {
                console.info("Bucket", name, "ready.");
                var names = buckets(name);

                if (buckets.created || name == "user")
                    for (var n in names)
                        bucket.update(n);
                if (onReady)
                    onReady(name, bucket);
            });
            bucket.start();
        } else {
            if (onReady)
                onReady(name, bucket);
        }

        return this.get(bn);
    };
    buckets.clear = function () {
        this.simperium = null;
        for (var n in this.namespace) {
            this.set(n, null);
            ;
        }
    };

    buckets.resumeSession = function () {
        var access_token = session().access_token, username = session().username;
        if (access_token && username) {
            var user = this.getBucket("user");
        }
    };

    buckets.simperium = null;

    buckets.api_key = document.essential.simperium_api_key;
    buckets.app_id = document.essential.simperium_app_id;
    buckets.authUrl = "https://auth.simperium.com/1/:app_id/authorize/".replace(":app_id", buckets.app_id);
    buckets.createUrl = "https://auth.simperium.com/1/:app_id/create/".replace(":app_id", buckets.app_id);

    buckets.authenticate = function (username, password, that, opts) {
        function success(data) {
            buckets.lastPassword = password;
            buckets.created = opts.create;

            account.BookAccess().message = "";
            session.set("username", data.username);
            session.set("userid", data.userid);
            session.set("access_token", data.access_token);
            session.set("password", buckets.lastPassword == "-");
            state.set("authenticated", true);
            Resolver("page").set("state.authenticated", true);

            var bucket = buckets.getBucket("user");

            if (opts.success)
                opts.success.call(that, data, opts);
        }

        function error(err, tp, code) {
            buckets.created = null;
            switch (code) {
                case "BAD REQUEST":
                    account.BookAccess().message = err.responseJSON.message;
                    break;

                case "UNAUTHORIZED":
                    if (err.responseText == "invalid password") {
                        if (opts.invalidPassword)
                            opts.invalidPassword.call(that, err, tp, code, opts);
                        session.set("password", true);
                    } else {
                        if (opts.unknown)
                            opts.unknown.call(that, err, tp, code, opts);
                    }
                    break;
            }
            if (opts.error)
                opts.error.call(that, err, tp, code, opts);
        }

        $.ajax({
            url: opts.create ? buckets.createUrl : buckets.authUrl,
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({ "username": username, "password": password }),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-Simperium-API-Key", buckets.api_key);
            },
            success: success,
            error: error
        });
    };

    buckets.forgetUser = function () {
        this.set("user.basic", {});
        this.set("user.features", {});
        session.set("access_token", null);
        setTimeout(function () {
            if (buckets.get("user", null))
                basic.set({});
            session.set("username", "");
            session.set("password", false);
        }, 0);
    };

    buckets.logOut = function () {
        this.stop();
        this.forgetUser();
        this.clear();
    };

    account.OUR_CITIES = {
        "zurich": { code: "zurich", name: "Zürich" }
    };

    account.GEO2CITY = {
        "CH19": account.OUR_CITIES.zurich,
        "CH25": account.OUR_CITIES.zurich
    };

    var state = Resolver("document::essential.state"), basic = Resolver("buckets::user.basic"), session = Resolver("document::essential.session"), geoip = Resolver("document::essential.geoip"), console = Resolver("essential::console::")();

    buckets.declare("user.basic", {});

    account.BookAccess = Generator(function () {
        basic.on("bind change", this, function (ev) {
            ev.data.user = basic();
        });
        this.session = session();
        if (this.session.username)
            basic.set("email", this.session.username);
        this.state = state();
        this.city = null;
        this.message = null;

        Resolver("document::essential.geoip").on("bind change", this, function (ev) {
            var base = ev.symbol == "geoip" ? ev.value : ev.base;

            ev.data.region_name = base.region_name;
            var city = account.GEO2CITY[base.country_code + base.region_code];
            ev.data.city = city;
        });
    }).restrict({ singleton: true, lifecycle: "page" });

    account.BookAccess.angularProvider = function (module, name) {
        var generator = this;

        module.provider(name, function GeneratorProvider() {
            this.$get = [generator];
        });
    };

    account.BookAccess.prototype.startSignUp = function () {
        if (state("authenticated"))
            return;

        var password = "-", _user = this.user;

        buckets.authenticate(_user.email, password, this, {
            success: function () {
                console.info("User in business! ", _user.email);
            },
            invalidPassword: function (err, tp, code) {
                console.log("Unhandled .. pass", _user.email, err, tp, code);
            },
            unknown: function (err, tp, code) {
                buckets.authenticate(_user.email, password, this, {
                    create: true,
                    success: function () {
                        console.info("Created user", _user.email);
                    },
                    error: function (err, tp, code) {
                        switch (err.status) {
                            case 400:
                                account.BookAccess().message = err.responseJSON.message;

                                break;
                            case 409:
                                break;
                        }

                        console.log("Failed to create user for", _user.email);
                    }
                });
            }
        });
    };

    account.BookAccess.prototype.iLiveIn = function (city) {
        if (account.OUR_CITIES[city])
            this.city = account.OUR_CITIES[city];
    };

    account.BookAccess.prototype.enableFeatures = function (features) {
        buckets.declare("user.features", {});
        buckets.reference("user.features").mixin(features);

        if (buckets.hasReadyUserBucket())
            buckets.getBucket("user").update("features");
    };

    account.BookAccess.prototype.applyPhone = function () {
        if (buckets.simperium) {
            var bucket = buckets.getBucket("user");
            if (bucket)
                bucket.update("basic");
        }
    };

    if (window["angular"]) {
        var module = angular.module("fluentAccount", []);
        account.BookAccess.angularProvider(module, "Access");
        Resolver.angularProvider("buckets", module, "$bucketsResolver");

        module.controller("signup", function ($scope) {
            $scope.decorator = "div";

            $scope.$safeDigest = function () {
                switch (this.$root.$$phase) {
                    case "$apply":
                    case "$digest":
                        break;
                    default:
                        this.$digest();
                }
            };

            $scope.session = session();
            session.on("change", function () {
                $scope.$safeDigest();
            });
            state.on("change", function (ev) {
                $scope.$safeDigest();
            });

            $scope.access = account.BookAccess();

            Resolver("document::essential.geoip").intoAngularScope($scope, {
                'city': 'city',
                'country_code': 'country_code',
                'region_code': 'region_code',
                'region_name': 'region_name'
            }, function (values, action) {
                var city = account.GEO2CITY[values.country_code + values.region_code];
                values.city = city;
            });
        });
    }

    Resolver("document").on("change", "readyState", function (ev) {
        switch (ev.value) {
            case "interactive":
                Resolver("buckets").resumeSession();
                break;
        }
    });
})(account || (account = {}));
!function (window) {
    var essential = Resolver("essential"), pageResolver = Resolver("page"), ApplicationConfig = essential("ApplicationConfig"), console = essential("console"), StatefulResolver = essential("StatefulResolver"), addEventListeners = essential("addEventListeners"), MutableEvent = essential("MutableEvent"), EnhancedDescriptor = essential("EnhancedDescriptor"), DescriptorQuery = essential("DescriptorQuery"), ElementPlacement = essential("ElementPlacement"), Layouter = essential("Layouter"), Laidout = essential("Laidout"), HTMLElement = essential("HTMLElement"), DialogAction = essential("DialogAction");

    var transEnd = {
        'WebkitTransition': 'webkitTransitionEnd',
        'MozTransition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'msTransition': 'MSTransitionEnd',
        'transition': 'transitionend'
    }[Modernizr.prefixed('transition')];

    var BODY_EVENTS = {
        click: function (ev) {
            ev = MutableEvent(ev);
            var wRole = ev.target.querySelector("[role=book]");
            if (wRole) {
                if (wRole.stateful("state.disabled"))
                    return;

                EnhancedDescriptor.all[wRole.uniqueID].instance.click(ev);
                ev.stopPropagation();
            }
        }
    };

    var BOOK_EVENTS = {
        click: function (ev) {
            ev = MutableEvent(ev);
            if (this.stateful("state.disabled"))
                return;

            EnhancedDescriptor.all[this.uniqueID].instance.click(ev);
            ev.stopPropagation();
        }
    };

    BOOK_EVENTS[transEnd] = function (ev) {
        EnhancedDescriptor.all[this.uniqueID].instance.transEnd(ev);
    };

    var expandedBook;

    var Book = function (el, config) {
        this.el = el;
        this.stateful = el.stateful;
        this.pos = config.pos;
        this.dest = config.dest;
        if (this.dest) {
            this.home = el.ownerDocument.querySelector(this.dest);
        } else {
            for (var _el = el; _el; _el = _el.parentNode) {
                if (_el.nodeType == 1 && _el.className.indexOf("bookspread") >= 0)
                    this.home = _el;
            }
        }

        this.stateful.set("map.class.state.flipped", "state-flipped");
        this.stateful.set("state.flipped", false);
        this.stateful.set("map.class.state.expanding", "state-expanding");
        this.stateful.set("state.expanding", false);
        this.stateful.set("map.class.state.collapsing", "state-collapsing");
        this.stateful.set("state.collapsing", false);
        this.stateful.set("map.class.state.collapsed", "state-collapsed");
        this.stateful.set("state.collapsed", true);

        this.stateful.set("map.class.state.reading", "state-reading");
        this.stateful.set("state.reading", false);

        this.prefix = config.prefix;

        this.type = "plain";
        if (config.feature)
            this.type = "feature";
        else if (config.spread)
            this.type = "spread";

        this.el.classList.add("bk-origin");

        this.el.classList.add(this.type + "-book");

        addEventListeners(this.el, BOOK_EVENTS);

        this._makeReaderBook();

        return;

        var ac = ApplicationConfig();
        var page = ac.loadPage(config.src, false, function (ev) {
            this.book.pageLoad({ page: this, book: this.book });
        });
        page.book = this;
    };

    Book.prototype.destroy = function () {
        this.bookEl = null;
        this.pageEl = null;
        this.readerBookEl = null;
    };

    Book.prototype._makeReaderBook = function () {
        this.ensureOpenBookSupport();

        this._createReaderElement();
    };

    Book.prototype._createReaderElement = function () {
        this.readerBookEl = HTMLElement("div", {
            "class": "bk-book", "make stateful": true
        }, '<div class="bk-promo"></div>');
        this.readerBookEl.stateful.set("state.hidden", true);

        var promo = this.el.querySelector(".bk-promo");
        if (promo) {
            for (var i = 0, c; c = promo.childNodes[i]; ++i)
                if (c.nodeType == 1) {
                    this.readerBookEl.firstChild.appendChild(c);
                }
        }

        this.reader.appendChild(this.readerBookEl);
    };

    Book.prototype.pageLoad = function (ev) {
        var bindingClass = "bk-book";
        bindingClass += " " + this.type + "-type";

        if (this.prefix)
            bindingClass += " " + this.prefix + "-book";

        if (this.pos && this.pos < 0)
            bindingClass += " left-" + (-this.pos);
        if (this.pos && this.pos > 0)
            bindingClass += " right-" + this.pos;

        var page = ev.page, book = ev.book, header = ev.page.body.querySelector("body > header"), footer = ev.page.body.querySelector("body > footer"), title = ev.page.head.querySelector("title"), author = ev.page.head.querySelector("meta[name=author]"), bookEl = this.bookEl = HTMLElement("div", { "class": bindingClass });

        if (header) {
            var frontEl = HTMLElement("div", { "class": "bk-front", "append to": bookEl }, '<div class="bk-cover">', '</div>', '<div class="bk-cover-back">', '</div>');

            for (var i = 0, c; c = header.childNodes[i]; ++i)
                if (c.nodeType == 1) {
                    frontEl.firstChild.appendChild(c);
                }
        } else
            this.warning = "No cover";

        if (footer) {
            var backEl = HTMLElement("div", { "class": "bk-back", "append to": bookEl });

            for (var i = 0, c; c = footer.childNodes[i]; ++i)
                if (c.nodeType == 1) {
                    backEl.appendChild(c);
                }
        }

        this.pageEl = HTMLElement("div", { "class": "bk-page", "append to": bookEl });

        if (this.type == "spread") {
            var backTwoEl = HTMLElement("div", { "class": "bk-back-two" });

            bookEl.appendChild(backTwoEl);
        } else {
            bookEl.appendChild(HTMLElement("div", { "class": "bk-top" }));
            bookEl.appendChild(HTMLElement("div", { "class": "bk-bottom" }));
            bookEl.appendChild(HTMLElement("div", { "class": "bk-right" }));
            HTMLElement("div", { "class": "bk-left", "append to": bookEl }, "<h2>", "<span>", title ? title.firstChild.nodeValue.split("|")[0] : "", "</span>", "<span>", author ? author.getAttribute("content") : "", "</span>", "</h2>");
        }

        this.home.appendChild(bookEl);
    };

    var openBook = {};

    Book.prototype.startOpen = function () {
        this.showReaderBook();

        this.stateful.set("state.collapsed", false);
        this.stateful.set("state.expanding", true);
        this.stateful.set("state.collapsing", false);

        pageResolver.set("state.open-book", true);
        this.reader.stateful.set("state.hidden", false);

        var eb = EnhancedDescriptor.all[expandedBook];
        if (eb) {
            eb.stateful.set("state.expanded", false);
        }
    };

    Book.prototype.finishOpen = function () {
        this.stateful.set("state.expanded", true);
        this.stateful.set("state.expanding", false);
        this.el.style.zIndex = "100";
        expandedBook = this.el.uniqueID;
    };

    Book.prototype.startClose = function () {
        this.stateful.set("state.expanded", false);
        this.stateful.set("state.expanding", false);
        this.stateful.set("state.collapsing", true);
        this.browsing = "closing";
    };

    Book.prototype.finishClose = function () {
        this.stateful.set("state.expanded", false);
        this.stateful.set("state.collapsing", false);
        this.stateful.set("state.collapsed", true);

        this.el.style.zIndex = "";
        expandedBook = 0;

        pageResolver.set("state.open-book", false);
        this.reader.stateful.set("state.hidden", true);

        this.hideContent();
    };

    Book.prototype.click = function (ev) {
        if (this.stateful("state.expanded") || this.stateful("state.expanding")) {
            this.startClose();
        } else {
            this.startOpen();
        }
    };

    Book.prototype.transEnd = function (ev) {
        if (this.stateful("state.collapsing")) {
            this.finishClose();
            return;
        }

        if (this.stateful("state.expanding")) {
            this.finishOpen();
            return;
        }
    };

    Book.prototype.showReaderBook = function () {
        var rect = this.el.getBoundingClientRect();
        this.readerBookEl.style.left = rect.left + "px";

        this.readerBookEl.style.top = rect.top + "px";

        this.readerBookEl.stateful.set("state.hidden", false);
        this.reader.stateful.set("state.hidden", false);
    };

    Book.prototype.hideContent = function () {
        this.readerBookEl.stateful.set("state.hidden", true);
        this.reader.stateful.set("state.hidden", true);
    };

    Book.prototype.prefixedTransform = Modernizr.prefixed("transform");

    Book.prototype.layout = function (layout) {
        var width = this.el.offsetParent.offsetWidth, left = this.el.offsetLeft;

        if (this.pos) {
            this.el.style.zIndex = String(10 - Math.abs(this.pos));
        }
    };

    Book.prototype.ensureOpenBookSupport = function () {
        if (this.bookSupported)
            return;

        pageResolver.set("map.class.state.open-book", "open-book");
        pageResolver.set("state.open-book", false);
        pageResolver.on("true", "state.open-book", this, function (ev) {
        });
        Book.prototype.bookSupported = true;

        addEventListeners(document.body, BODY_EVENTS);

        if (this.reader == undefined) {
            var r = Book.prototype.reader = HTMLElement("div", {
                "append to": document.body,
                "id": "book-reader",
                "make stateful": true });
            r.stateful.set("state.hidden", true);
        }
    };

    Book.prototype.bookSupported = false;
    Book.prototype.reader = undefined;

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports.Book = Book;
    } else {
        window.reader = { Book: Book };
    }

    reader.Book.handlers = {};

    reader.Book.handlers.enhance = function (el, role, config) {
        var book = new reader.Book(el, config);

        return book;
    };

    reader.Book.handlers.layout = function (el, layout, instance) {
        if (instance)
            return instance.layout(layout);
    };

    reader.Book.handlers.discard = function (el, role, instance) {
        if (instance)
            instance.destroy(el);
    };
}(this);
!function (window) {
    function Slider(el, role, config, context) {
        config.cbPrev = this.cbPrev.bind(this);
        config.cbNext = this.cbNext.bind(this);
        jQuery(el).layerSlider(config);
    }
    Slider.prototype.layout = function () {
    };
    Slider.prototype.destroy = function () {
    };

    Slider.prototype.cbPrev = function (data) {
        setTimeout(this.reflectSlide.bind(this, "prev", data), 100);
    };
    Slider.prototype.cbNext = function (data) {
        setTimeout(this.reflectSlide.bind(this, "next", data), 100);
    };

    Slider.prototype.reflectSlide = function (direction, data) {
        var config = Resolver.config(data.nextLayer[0]);

        if (config && config['set-hash'])
            document.essential.router.setHash(config['set-hash']);
    };

    var slider = { enhance: null, Slider: null };
    if (typeof module === 'object' && typeof module.exports === 'object') {
        slider = module.exports;
    } else {
        window.slider = slider;
    }

    slider.enhance = function (el, role, config, context) {
        if (window.jQuery == undefined || jQuery.fn.layerSlider == undefined)
            return false;

        var slider = new Slider(el, role, config, context);
        return slider;
    };
    slider.Slider = Slider;
}(window);
!function () {
    var HTMLElement = Resolver("essential::HTMLElement::");

    Resolver("document::essential.handlers").set("enhance.audio", function (el, role, conf) {
        if (!el.canPlayType) {
            return null;
        }

        var cls = el.className.split(" ")[0];
        var avail = HTMLElement("p", { "class": cls + "-audio", "hidden": false }), unavail = HTMLElement("p", { "class": cls + "-audio-unavailable", "hidden": false }, '<em class="error"><strong>Error:</strong> You will not be able to do the read-along audio because your browser is not able to play MP3, Ogg, or WAV audio formats.</em>');

        el.parentNode.insertBefore(avail, el);
        el.parentNode.insertBefore(unavail, el);
        avail.appendChild(el);

        var args = {
            "text_element": document.querySelector(conf.text),
            "audio_element": avail,
            "autofocus_current_word": conf.autofocus_current_word === undefined ? true : conf.autofocus_current_word
        };

        avail.hidden = false;

        return {
            "audio": el,
            "avail": avail,
            "unavail": unavail
        };
    });
}();
!function () {
    var essential = Resolver("essential"), pageResolver = Resolver("page"), templates = Resolver("document::essential.templates::"), Layouter = essential("Layouter"), Laidout = essential("Laidout"), log = essential("console")();

    var HTMLElement = Resolver("essential::HTMLElement::");
    var DialogAction = Resolver("essential::DialogAction::");
    var DescriptorQuery = Resolver("essential::DescriptorQuery::");
    var pageState = Resolver("page::state");
    var pageProgress = Resolver("page::connection.loadingProgress");

    var policy = {
        DECORATORS: {
            "data-resolve": {
                props: true
            }
        }
    };

    pageResolver.declare("handlers.prepare.resolved", function (el, role) {
        var els = el.getElementsByTagName("*"), text = [], queued = el.queued = [], attrs, dataResolve;

        attrs = HTMLElement.fn.describeAttributes(el, policy);
        attrs.texts = [];

        if (attrs.texts.length === 0) {
            attrs.texts = attrs.texts.concat(HTMLElement.fn.findTextSubstitutions(el));
        }

        if (attrs.texts.length || dataResolve) {
            attrs.el = el;
            queued.push(attrs);
            for (var i = 0, t; t = attrs.texts[i]; ++i)
                t.renderText.call(t, pageResolver);
        }

        for (var i = 0, ce; ce = els[i]; ++i) {
            attrs = HTMLElement.fn.describeAttributes(ce, policy);
            dataResolve = attrs["data-resolve"];

            attrs.texts = [];

            if (dataResolve) {
                if (dataResolve.props.text) {
                    attrs.texts.push(HTMLElement.fn.makeTextSubstitution(ce, dataResolve.props.text));
                }
                if (dataResolve.props.html) {
                }
            }
            if (attrs.texts.length === 0) {
                attrs.texts = attrs.texts.concat(HTMLElement.fn.findTextSubstitutions(ce));
            }

            if (attrs.texts.length || dataResolve) {
                attrs.el = ce;
                queued.push(attrs);
                for (var j = 0, t; t = attrs.texts[j]; ++j)
                    t.renderText.call(t, pageResolver);
            }
        }
    });

    pageResolver.declare("handlers.enhance.resolved", function (el, role, config, context) {
        function textRefresher(t, resolver) {
            return function (ev) {
                t.renderText.call(t, resolver);
            };
        }

        function textUpdaters(attrs, resolver) {
            for (var i = 0, t; t = attrs.texts[i]; ++i) {
                t.renderText.call(t, resolver);
                for (var j = 0, s; s = t.selectors[i]; ++i)
                    if (s.indexOf("::") >= 0) {
                        var parts = s.split("::");
                        Resolver(parts[0]).on("change", parts[1], textRefresher(t, resolver));
                    } else {
                        resolver.on("change", s, textRefresher(t, resolver));
                    }
            }
        }

        if (el.queued) {
            for (var i = 0, q; q = el.queued[i]; ++i) {
                textUpdaters(q, el.stateful);
            }

            el.queued = undefined;
        }
    });
}();
var ProtectedPresentation;

!function () {
    var HTMLElement = Resolver("essential::HTMLElement::"), StatefulResolver = Resolver("essential::StatefulResolver::");
    var logger = Resolver("essential::console::")();

    var ProtectedPresentation = window["ProtectedPresentation"] = function (el, config) {
        this.el = el;
        this.hypeDocument = null;
        this.progressEl = HTMLElement("div", {
            "class": "play-progress", "append to": el,
            "make stateful": true,
            "enhance element": true,
            "role": "resolved"
        }, '<div class="progress" data-resolve="info.progress"></div>');
        this.progressEl.stateful.set("state.hidden", true);
        this.spokenScene = {};
        this.spokenWords = {};

        if (config.featureId) {
            var feature = {
                doc: config.featureId
            };
            for (var n in config.featureData) {
                feature[n] = config.featureData[n];
            }
            this.applyFeature(feature);
        }

        this.allowBack = false;
        this.allowSkip = true;

        this.useCache = false;
    };

    ProtectedPresentation.active = null;

    ProtectedPresentation.byId = ProtectedPresentation.prototype.byId = {};

    ProtectedPresentation.prototype.destroy = function () {
        this.hypeDocument = null;

        if (ProtectedPresentation.active == this)
            ProtectedPresentation.active = null;

        for (var n in this.spokenScene) {
            this.spokenScene[n] = null;
        }

        for (var n in this.spokenWords) {
            this.spokenWords[n] = null;
        }

        if (this.hypeId)
            this.byId[this.hypeId] = null;
    };

    ProtectedPresentation.prototype.layout = function (layout) {
        this.el.style.maxHeight = layout.width + "px";
    };

    ProtectedPresentation.prototype._newLoadQueue = function (sceneName) {
        this._dropLoadQueue(sceneName);
        this._ensureLoadQueue(sceneName);
    };

    ProtectedPresentation.prototype._ensureLoadQueue = function (sceneName) {
        var scene = this._getScene(sceneName);
        if (scene.preload == undefined) {
            scene.preload = new createjs.LoadQueue();
            scene.preload.sceneName = sceneName;
            scene.preload.installPlugin(createjs.Sound);
            scene.preload.addEventListener("fileload", this._fileloadComplete.bind(this));
            scene.preload.addEventListener("complete", this._complete.bind(this));
            scene.preload.addEventListener("error", this._error.bind(this));
            scene.preload.addEventListener("progress", this._progress.bind(this));
        }
    };

    ProtectedPresentation.prototype._dropLoadQueue = function (sceneName) {
        var scene = this._getScene(sceneName);

        if (scene.preload) {
            scene.preload.removeAllEventListeners();
            scene.preload.removeAll();
            scene.preload = null;
        }
    };

    ProtectedPresentation.prototype._fileloadComplete = function (event) {
        this.spokenWords[event.item.id].markLoaded(event.item);
        logger.info("file load complete", event.item);
    };

    ProtectedPresentation.prototype._completedPlaying = function (spoken) {
    };

    ProtectedPresentation.prototype._complete = function (event) {
        this.progressEl.stateful.set("state.error", false);
        this.progressEl.stateful.set("state.loading", false);
        this.progressEl.stateful.set("state.hidden", true);

        var sceneName = event.target.sceneName, scene = this.spokenScene[sceneName];
        if (scene) {
            for (var n in scene.spoken) {
                var spoken = scene.spoken[n];
                spoken.markLoaded(event.target._loadItemsById[n]);
            }
        }
        logger.info("preload complete", event, scene);

        if (this.hypeDocument)
            this.hypeDocument.continueTimelineNamed("Main Timeline");
        this.waitingForPreloadComplete = false;
    };

    ProtectedPresentation.prototype._error = function (event) {
        this.progressEl.stateful.set("state.error", true);
        this.progressEl.stateful.set("info.file", event.item.src);
    };

    ProtectedPresentation.prototype._progress = function (event) {
        var scene = this._getScene(event.target.sceneName);

        this.progressEl.stateful.set("state.error", false);
        this.progressEl.stateful.set("info.file", "");
        var progressText = "";
        if (scene) {
            progressText = (scene.preload.progress.toFixed(2) * 100) + "%";
        }
        this.progressEl.stateful.set("info.progress", progressText);
        this.progressEl.firstChild.innerHTML = progressText;
    };

    ProtectedPresentation.restart = function () {
        for (var n in ProtectedPresentation.byId) {
            var pp = ProtectedPresentation.byId[n];
            pp.restart();
        }
    };

    ProtectedPresentation.prototype.restart = function () {
        this._newLoadQueue(this.currentSceneName);
        if (this.hypeDocument) {
            this.hypeDocument.showSceneNamed("Main Scene");
        }
    };

    ProtectedPresentation.continueSpeaking = function () {
        for (var n in ProtectedPresentation.byId) {
            var pp = ProtectedPresentation.byId[n];
            pp.continueSpeaking();
        }
    };

    ProtectedPresentation.prototype.continueSpeaking = function () {
        if (this.pausedSpoken)
            this.pausedSpoken.play();
        else if (this.hypeDocument) {
            this.playNextSpoken(this.hypeDocument.currentSceneName());
        }
        if (this.hypeDocument)
            this.hypeDocument.continueTimelineNamed("Main Timeline");
    };

    ProtectedPresentation.pauseSpeaking = function () {
        for (var n in ProtectedPresentation.byId) {
            var pp = ProtectedPresentation.byId[n];
            pp.pauseSpeaking();
        }
    };

    ProtectedPresentation.prototype.pauseSpeaking = function () {
        if (this.playingSpoken)
            this.playingSpoken.pause();
        if (this.hypeDocument)
            this.hypeDocument.pauseTimelineNamed("Main Timeline");

        var spokenWords = Resolver("spoken-words");
        spokenWords.set("available.playing", false);
        spokenWords.set("available.paused", true);
    };

    ProtectedPresentation.skipSpeaking = function () {
        for (var n in ProtectedPresentation.byId) {
            var pp = ProtectedPresentation.byId[n];
            pp.skipSpeaking();
        }
    };

    ProtectedPresentation.prototype.skipSpeaking = function () {
        if (this.playingSpoken || this.pausedSpoken) {
            var spoken = this.playingSpoken || this.pausedSpoken;
            spoken.stop();
        }

        this._newLoadQueue(this.currentSceneName);

        if (this.hypeDocument) {
            this.hypeDocument.showNextScene();
            this.hypeDocument.playTimelineNamed("Main Timeline");
        }
    };

    ProtectedPresentation.backSpeaking = function () {
        for (var n in ProtectedPresentation.byId) {
            var pp = ProtectedPresentation.byId[n];
            pp.backSpeaking();
        }
    };

    ProtectedPresentation.prototype.backSpeaking = function () {
        if (this.playingSpoken || this.pausedSpoken) {
            var spoken = this.playingSpoken || this.pausedSpoken;
            spoken.stop();
        }

        this._newLoadQueue(this.currentSceneName);

        if (this.hypeDocument) {
            this.hypeDocument.showPreviousScene();
            this.hypeDocument.playTimelineNamed("Main Timeline");
        }
    };

    ProtectedPresentation.prototype.applyFeature = function (feature) {
        if (feature.js) {
            this.resourcePath = feature.path;
            this.resourcePrefix = (location.host == "fluentglobe.com" && this.useCache) ? "http://cache.fluentglobe.com" + this.resourcePath : this.resourcePath;
            this.elementId = feature.id;
            this.hypeId = feature.doc;

            if (this.elementId == "sfpch_hype_container" && this.hypeId == null)
                this.hypeId = "sfp-ch";
            if (this.hypeId)
                this.byId[this.hypeId] = this;

            var el = HTMLElement("div", { id: feature.id });
            this.el.appendChild(el);

            var script = HTMLElement("script", {
                "charset": "utf-8"
            });
            script.src = feature.path + feature.js;
            document.head.appendChild(script);
        } else if (feature.html) {
        }
    };

    ProtectedPresentation.prototype._preloadSpoken = function (sceneName) {
        this._ensureLoadQueue(sceneName);

        var scene = this.spokenScene[sceneName];
        if (scene)
            for (var n in scene.spoken) {
                this.progressEl.stateful.set("state.loading", true);
                this.progressEl.stateful.set("state.hidden", false);

                var spoken = scene.spoken[n];
                spoken.load();
            }
    };

    ProtectedPresentation.prototype._updatePrevNextRestart = function () {
        ProtectedPresentation.active = this;

        if (this.hypeDocument && this.hypeId) {
            var scenes = this.hypeDocument.sceneNames(), current = this.hypeDocument.currentSceneName(), ixc = scenes.indexOf(current);
            var spokenWords = Resolver("spoken-words");

            spokenWords.set("available.next", (scenes.length - 1 > ixc) && this.allowSkip);

            spokenWords.set("available.prev", (0 < ixc) && this.allowBack);

            spokenWords.set("available.restart", true);
        }
    };

    ProtectedPresentation.prototype.loadingScene = function (sceneName) {
        this.currentSceneName = sceneName;
        this._preloadSpoken(sceneName);
        this._updatePrevNextRestart();
    };

    ProtectedPresentation.prototype.droppingScene = function (sceneName) {
        if (this.playingSpoken || this.pausedSpoken) {
            var spoken = this.playingSpoken || this.pausedSpoken;
            spoken.stop();
        }
        var spokenWords = Resolver("spoken-words");
        spokenWords.set("available.playing", false);

        var scene = this.spokenScene[sceneName];
        if (scene) {
            scene.unplayed.length = 0;
            for (var n in scene.spoken) {
                var spoken = scene.spoken[n];
                spoken.unload();
                scene.unplayed.push(n);
            }
            logger.log("Unloaded scene", sceneName, "spoken:", scene.unplayed.join(" "));
        }
    };

    ProtectedPresentation.prototype.addSpoken = function (spokenId, name, sceneName) {
        var scene = this._getScene(sceneName), spoken = this.spokenWords[spokenId];

        if (spoken == undefined) {
            spoken = scene.spoken[spokenId] = new SpokenWord(spokenId, name, this.hypeId, sceneName);
            scene.unplayed.push(spokenId);
            this.spokenWords[spokenId] = spoken;
        } else {
            if (scene.spoken[spokenId] == null)
                scene.spoken[spokenId] = spoken;
        }
        spoken.load();

        return spoken;
    };

    ProtectedPresentation.prototype.queueNextSpoken = function (sceneName) {
        var scene = this._getScene(sceneName);
        scene.queued = scene.unplayed.shift();
        var spoken = this.spokenWords[scene.queued];
        if (spoken) {
            logger.info("next spoken", spoken.name, "for scene", sceneName);
        } else {
            logger.error("no spoken to queue in", sceneName, "queue.");
        }
        var spokenWords = Resolver("spoken-words");
        spokenWords.set("available.queued", (!!spoken));
    };

    ProtectedPresentation.prototype.playNextSpoken = function (sceneName) {
        var scene = this._getScene(sceneName), spoken = this.spokenWords[scene.queued];
        scene.queued = null;
        var spokenWords = Resolver("spoken-words");

        if (spoken) {
            spokenWords.set("available.playing", true);
            spokenWords.set("available.queued", false);
            spokenWords.set("available.paused", false);
            spoken.play();
        } else {
            logger.error("no spoken to play in", sceneName, "queue.");
        }
    };

    ProtectedPresentation.prototype._getScene = function (sceneName) {
        var scene = this.spokenScene[sceneName];
        if (scene == undefined) {
            scene = this.spokenScene[sceneName] = { spoken: {}, unplayed: [] };
        }
        return scene;
    };

    ProtectedPresentation.prototype.getResourcePath = function () {
        return this.resourcePath;
    };

    ProtectedPresentation.prototype.applyHTML = function (page) {
        SubPageApplyDest.call(page, this.el);
    };

    var SubPageApplyDest = function (dest) {
        var e = this.body.firstElementChild !== undefined ? this.body.firstElementChild : this.body.firstChild, db = dest, fc = db.firstElementChild !== undefined ? db.firstElementChild : db.firstChild;

        if (this.applied)
            return;

        var applied = this.applied = [];
        while (e) {
            if (fc == null) {
                db.appendChild(e);
            } else {
                db.insertBefore(e, fc);
            }
            applied.push(e);
            e = this.body.firstElementChild !== undefined ? this.body.firstElementChild : this.body.firstChild;
        }
    };

    ProtectedPresentation.handlers = {};

    ProtectedPresentation.handlers.enhance = function (el, role, config) {
        var presentation = new ProtectedPresentation(el, config);
        Resolver("buckets::user.features").on("bind change", function (ev) {
            var featuresValue = ev.resolver("user.features");
            if (featuresValue) {
                var feature = featuresValue[config.feature];
                if (feature) {
                    presentation.applyFeature(feature);
                }
            }
        });

        return presentation;
    };

    ProtectedPresentation.handlers.layout = function (el, layout, instance) {
        if (instance)
            return instance.layout(layout);
    };

    ProtectedPresentation.handlers.discard = function (el, role, instance) {
        instance.destroy();
    };
}();
createjs.Sound.alternateExtensions = ["mp3"];

createjs.Sound.registerPlugins([createjs.HTMLAudioPlugin]);

Resolver("spoken-words", {
    available: {
        restart: false,
        queued: false,
        paused: false,
        playing: false,
        next: false,
        prev: false
    }
});

var SpokenWord = function (id, name, docId, sceneName) {
    this.id = id;
    this.name = name;
    this.docId = docId;
    this.sceneName = sceneName;
    this.known[name] = this;
    this.presentation = ProtectedPresentation.prototype.byId[docId];
    this.path = this.presentation ? this.presentation.resourcePrefix + this.name : "/assets/default/" + this.name;

    this.path = this.path.replace(/ /g, "%20");

    this.instance;
};

!function () {
    var logger = Resolver("essential::console::")();

    function spokenLoadHandler(event) {
        var spoken = SpokenWord.prototype.known[event.id];
        if (spoken && spoken.playOnLoad)
            spoken.play();
    }

    SpokenWord.known = SpokenWord.prototype.known = {};
    SpokenWord.prototype.capabilities = createjs.Sound.getCapabilities();

    SpokenWord.prototype._prepareLoad = function () {
        if (this.loadHandler)
            return;

        SpokenWord.prototype.loadHandler = createjs.Sound.addEventListener("fileload", spokenLoadHandler);
    };

    SpokenWord.prototype._createInstance = function () {
        this.instance = createjs.Sound.createInstance(this.id);

        this.instance.addEventListener("playComplete", this._completed.bind(this));
        this.instance.addEventListener("failed", this._failed.bind(this));
    };

    SpokenWord.prototype.getManifest = function () {
        return [
            { id: this.id, src: this.path }
        ];
    };

    SpokenWord.prototype.markLoaded = function (item) {
        if (!this.instance) {
            this.preloading = false;
            this.preloaded = true;
            this._createInstance();
            logger.log("set instance for", this.name, item.ext ? "extension=" + item.ext : "");
        }
    };

    SpokenWord.prototype.load = function () {
        if (this.preloading || this.preloaded)
            return;

        if (this.presentation) {
            var scene = this.presentation._getScene(this.presentation.currentSceneName);
            scene.preload.loadManifest(this.getManifest());
            this.preloading = true;
        }
    };

    SpokenWord.prototype.unload = function () {
        if (!this.preloaded)
            return;

        this.instance = null;
        createjs.Sound.removeSound(this.id);
        this.preloaded = false;
        this.preloading = false;
    };

    SpokenWord.prototype._completed = function (event) {
        this.instance.setPosition(0);
        if (this.presentation) {
            if (this.presentation.playingSpoken == this) {
                this.presentation._completedPlaying(this);
                this.presentation.playingSpoken = null;
            }
        }
    };

    SpokenWord.prototype._failed = function (event) {
        logger.error("Failed spoken word", event);
    };

    SpokenWord.prototype.play = function () {
        if (!this.instance) {
            logger.log("playing before load of", this.name, this.preloaded ? "was" : "wasn't", "preloaded", this.preloading);
            if (this.preloaded)
                this._createInstance();
            else {
                logger.error("Flagging it for load");

                this.playOnLoad = true;
                this.load();
                return;
            }
        }

        if (this.instance) {
            if (this.instance.resume() == false) {
                this.instance.play();
            }
            if (this.presentation) {
                this.presentation.playingSpoken = this;
                this.presentation.pausedSpoken = null;
                logger.log("setting playingSpoken");
            }
        } else {
            logger.error("still no instance", this);
        }
    };

    SpokenWord.prototype.pause = function () {
        if (this.instance) {
            this.instance.pause();
            if (this.presentation) {
                this.presentation.pausedSpoken = this;
                this.presentation.playingSpoken = null;
                logger.log("pause/clearing playingSpoken");
            }
        }
    };

    SpokenWord.prototype.stop = function () {
        if (!this.instance)
            return;

        this.instance.stop();
        if (this.presentation) {
            this.presentation.pausedSpoken = null;
            this.presentation.playingSpoken = null;
            logger.log("stop/clear playingSpoken");
        }
    };

    SpokenWord.prototype.togglePlay = function () {
        if (this.instance)
            this.play();
        else
            this.pause();
    };
}();
function getSpoken(name) {
    return SpokenWord.prototype.known[name];
}

function registerSpoken(map) {
    this.spokenWords = this.spokenWords || {};
    for (var n in map) {
        this.spokenWords[n] = new SpokenWord(n, map[n], this.documentName(), null);
    }
}

function afterDefineScene(sceneName, map, defaultTimeline) {
    this.spokenWords = this.spokenWords || {};
    var presentation = ProtectedPresentation.byId[this.documentName()];
    if (presentation)
        presentation._preloadSpoken(sceneName);
    for (var n in map) {
        if (presentation)
            this.spokenWords[n] = presentation.addSpoken(n, map[n], sceneName);
        else
            this.spokenWords[n] = new SpokenWord(n, map[n], this.documentName(), sceneName);
    }
    presentation.hypeDocument.pauseTimelineNamed(defaultTimeline || "Main Timeline");
}

function queueNextSpoken(sceneName) {
    var presentation = ProtectedPresentation.byId[this.documentName()];
    if (presentation)
        presentation.queueNextSpoken(sceneName);
}

function playNextSpoken(sceneName) {
    var presentation = ProtectedPresentation.byId[this.documentName()];
    if (presentation)
        presentation.playNextSpoken(sceneName);
}

function hypeDocCallback(hypeDocument, element, event) {
    hypeDocument.getSpoken = getSpoken;
    hypeDocument.registerSpoken = registerSpoken;

    hypeDocument.afterDefineScene = afterDefineScene;
    hypeDocument.queueNextSpoken = queueNextSpoken;
    hypeDocument.playNextSpoken = playNextSpoken;

    var presentation = ProtectedPresentation.byId[hypeDocument.documentName()];
    if (presentation)
        presentation.hypeDocument = hypeDocument;
}

function hypeSceneCallback(hypeDocument, element, event) {
    var presentation = ProtectedPresentation.byId[hypeDocument.documentName()];
    switch (event.type) {
        case "HypeSceneLoad":
            if (!presentation.waitingForPreloadComplete)
                setTimeout(function () {
                    hypeDocument.pauseTimelineNamed("Main Timeline");
                }, 0);
            presentation.waitingForPreloadComplete = true;
            presentation.loadingScene(hypeDocument.currentSceneName());
            break;

        case "HypeSceneUnload":
            presentation.droppingScene(hypeDocument.currentSceneName());
            break;
    }
}

if ("HYPE_eventListeners" in window === false) {
    window["HYPE_eventListeners"] = Array();
}
window["HYPE_eventListeners"].push({ "type": "HypeDocumentLoad", "callback": hypeDocCallback });
window["HYPE_eventListeners"].push({ "type": "HypeSceneLoad", "callback": hypeSceneCallback });
window["HYPE_eventListeners"].push({ "type": "HypeSceneUnload", "callback": hypeSceneCallback });
SpokenWord.fgSpokenControls = [
    '$compile', '$animate',
    function ($compile, $animate) {
        var spokenWords = Resolver("spoken-words");

        var logger = Resolver("essential::console::")();

        var POINTS = {
            "restart": "available.restart",
            "next": "available.next",
            "prev": "available.prev",
            "play": "available.queued || available.paused",
            "pause": "available.playing"
        };

        function link($scope, jqElement, attrs) {
            $scope.available = spokenWords("available");

            $scope.$safeDigest = function () {
                switch (this.$root.$$phase) {
                    case "$apply":
                    case "$digest":
                        break;
                    default:
                        this.$digest();
                }
            };

            spokenWords.on("change", "available", function () {
                $scope.$apply(function () {
                });
            });

            jqElement.children().each(function (i, e) {
                var cp = e.getAttribute("control-point");
                if (cp != null) {
                    var w = POINTS[cp];
                    if (w)
                        $scope.$watch(w, function (value, old, scope) {
                            var jq = jQuery(e);
                            jq.addClass(value ? "ng-show" : "ng-hide");
                            jq.removeClass(value ? "ng-hide" : "ng-show");
                        });
                }
            });
        }

        return {
            scope: {},
            link: link
        };
    }
];

SpokenWord.fgSpoken = [
    '$compile',
    function ($compile) {
        function link(scope, jqElement, attrs) {
        }

        return {
            scope: {},
            link: link
        };
    }
];
Resolver("page").set("map.class.state.stress-free-feature", "stress-free-feature-enabled");
Resolver("page").set("map.class.state.appified", "appified");

Resolver("page").set("state.stress-free-feature", !!Resolver("buckets")("user.features.stress-free-switzerland", "null"));
Resolver("page").set("state.appified", !!Resolver("buckets")("user.features.stress-free-switzerland", "null"));

Resolver("buckets::user.features").on("change", function (ev) {
    var enabled = !!Resolver("buckets")("user.features.stress-free-switzerland", "null");
    Resolver("page").set("state.stress-free-feature", enabled);

    var appified = enabled;
    Resolver("page").set("state.appified", appified);
});

Resolver("document").set("essential.handlers.enhance.book", reader.Book.handlers.enhance);
Resolver("document").set("essential.handlers.layout.book", reader.Book.handlers.layout);
Resolver("document").set("essential.handlers.discard.book", reader.Book.handlers.discard);

Resolver("document").set("essential.handlers.enhance.slider", slider.enhance);
Resolver("document").set("essential.handlers.layout.slider", function (el, layout, instance) {
    if (instance)
        return instance.layout(layout);
});
Resolver("document").set("essential.handlers.discard.slider", function (el, role, instance) {
    if (instance)
        instance.destroy(el);
});

Resolver("document").set("essential.handlers.enhance.presentation", ProtectedPresentation["handlers"].enhance);
Resolver("document").set("essential.handlers.layout.presentation", ProtectedPresentation["handlers"].layout);
Resolver("document").set("essential.handlers.discard.presentation", ProtectedPresentation["handlers"].discard);

if (window["angular"]) {
    var fluentApp = angular.module('fluentApp', ["fluentAccount"]);
    fluentApp.config([
        '$interpolateProvider', function ($interpolateProvider) {
            return $interpolateProvider.startSymbol('{(').endSymbol(')}');
        }
    ]);

    fluentApp.run([
        '$templateCache', '$http', function ($templateCache, $http) {
        }]);

    fluentApp.controller("add-review", [
        '$scope', function ($scope) {
            $scope.device = 'off';
        }]);

    fluentApp.controller("blank", [
        '$scope', function ($scope) {
        }]);

    fluentApp.directive('fgSpokenControls', SpokenWord.fgSpokenControls);

    fluentApp.directive('fgSpoken', SpokenWord.fgSpoken);

    fluentApp.directive('fgChoices', [
        '$compile', function ($compile) {
            var radios = '<label class="" ng-repeat="option in __.options">' + '<input type="radio" name="{{ __.name }}" value="{{ option.value }}">{{ option.text }}</label>';

            function link(scope, jqElement, attrs) {
                var out, langContext = attrs.langContext, __ = {
                    name: attrs.name,
                    options: []
                };
                scope.__ = __;

                for (var e, c = jqElement.children(), i = 0; e = c[i]; ++i) {
                    __.options.push({
                        value: e.value || '',
                        text: e.label || e.innerHTML || ''
                    });
                }

                switch (attrs.fgChoices) {
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
                link: link
            };
        }]);

    fluentApp.directive('fgStep', $FgStepDirective);

    fluentApp.directive('fgCard', $FgCardDirective);
}

document.essential.router.manage({ href: "/stress-free-presentation" }, "essential.resources", function (path, action) {
    impress('stress-free-presentation').init();

    return false;
});

document.essential.router.manage({ href: "/restart-presentation" }, "essential.resources", function (path, action) {
    ProtectedPresentation.restart();
    document.essential.router.clearHash();
    return false;
});

document.essential.router.manage({ href: "/continue-speaking" }, "essential.resources", function (path, action) {
    ProtectedPresentation.continueSpeaking();
    document.essential.router.clearHash();
    return false;
});

document.essential.router.manage({ href: "/pause-speaking" }, "essential.resources", function (path, action) {
    ProtectedPresentation.pauseSpeaking();
    document.essential.router.clearHash();
    return false;
});

document.essential.router.manage({ href: "/back-speaking" }, "essential.resources", function (path, action) {
    ProtectedPresentation.backSpeaking();
    document.essential.router.clearHash();
    return false;
});

document.essential.router.manage({ href: "/skip-speaking" }, "essential.resources", function (path, action) {
    ProtectedPresentation.skipSpeaking();
    document.essential.router.clearHash();
    return false;
});

document.essential.router.manage({ href: "/log-out" }, "essential.resources", function (path, action) {
    Resolver("document").set("essential.state.authenticated", false);
    Resolver("page").set("state.authenticated", false);
    Resolver("buckets").logOut();
    Resolver("page").set("state.expanded", false);

    document.essential.router.clearHash();

    return false;
});

document.essential.router.manage({ href: "/present_for" }, "essential.resources", function (path, action) {
    var parts = path.split("&"), present = parts[0].split("=");

    if (parts.length > 1 || present.length > 1) {
        Resolver("page").set("state.expanded", false);

        var access = account.BookAccess();

        for (var i = 0, part; part = parts[i]; ++i) {
            var bits = part.split("="), name = bits.shift(), value = bits.join("=");
            switch (name) {
                case "/present_for":
                    if (value && value.indexOf("@") > 0) {
                        access.user.email = present[1];
                        access.startSignUp();
                    } else {
                    }
                    break;
                case "enable":
                    try  {
                        var decoded = JSON.parse(atob(value));
                        access.enableFeatures(decoded);
                    } catch (ex) {
                        console.error("Failed to enable features", decoded, ex);
                    }
                    break;
            }
        }

        document.essential.router.clearHash();
    }
    return false;
});
