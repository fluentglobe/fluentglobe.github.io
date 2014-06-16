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

    function onIframeLoad(ev) {
        this.stateful.set("state.hidden", false);
    }

    EnhancedForm.prototype.planIframeSubmit = function (el) {
        if (this.iframeId == undefined) {
            this.iframeId = "form-target-" + (newIframeId++);

            this.targetIframe = HTMLElement("iframe", {
                "id": this.iframeId, "frameborder": "0", "border": "0",
                "make stateful": true,
                "append to": el
            });
            this.targetIframe.stateful.set("state.hidden", true);
            this.targetIframe.onload = onIframeLoad;
        }

        el.target = this.iframeId;
        this.actionParts.protocol = this.actionParts.protocol.replace("client+http", "http");
        this.submit = this.iframeSubmit;
    };

    EnhancedForm.prototype.iframeSubmit = function (ev, el) {
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
        } else {
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

    Resolver("document::essential.state").copyToScope = Resolver("document::essential.geoip").copyToScope = function (scope, names, adjuster) {
        var v = {};
        for (var n in names) {
            v[n] = this.get(n);
        }
        if (adjuster)
            adjuster(v, 'to scope');
        for (var n in names) {
            scope[names[n]] = v[n];
        }
    };

    Resolver("document::essential.state").intoAngularScope = Resolver("document::essential.geoip").intoAngularScope = function (scope, names, adjuster) {
        this.copyToScope(scope, names, adjuster);

        this.on("change", this, function (ev) {
            ev.data.copyToScope(scope, names, adjuster);
            if (scope.$safeDigest)
                scope.$safeDigest();
            else
                scope.$digest();
        });
    };

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
    };

    Router.prototype._hideIfNotHash = function (el, config) {
        var id = el.id, hash = location.hash.replace("#", "");
        if (typeof config["require-hash"] == "string")
            id = config["require-hash"];
        el.stateful.set("state.hidden", id !== hash);
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
            var els = Resolver("document").elementsWithConfig();
            for (var i = 0, el; el = els[i]; ++i) {
                var config = Resolver.config(el);
                if (config["require-hash"])
                    document.essential.router.requireHash(el, config);
            }
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
                var cur = (scope.currentStep == undefined) ? null : scope.steps[scope.currentStep], nextStep = cur == null ? scope.firstStep : cur.nextStep, ok = true;

                if (explicit)
                    nextStep = scope.steps[explicit] ? explicit : nextStep;

                if (cur && scope.bucketName) {
                    Resolver("buckets").declare([scope.bucketName, cur.results], {});
                    Resolver("buckets").reference([scope.bucketName, cur.results]).mixin(scope[cur.results]);
                    Resolver("buckets").getBucket(scope.bucketName).update(cur.results);
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
                scope.results = [];
                for (var n in results)
                    scope.results.push(n);

                if (attrs.bucket) {
                    for (var i = 0, r; r = scope.results[i]; ++i) {
                        var ref = Resolver("buckets").reference([attrs.bucket, r].join("."));
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
        if (this.simperium == undefined)
            this.simperium = new Simperium(this.app_id, { token: session("access_token") });
        return this.simperium;
    };

    buckets.stop = function () {
        if (this.simperium) {
            this.simperium.stop();
            this.simperium = null;
        }
    };

    buckets.getBucket = function (name, onReady) {
        var bn = name + "Bucket", simperium = this.getSimperium();

        this.declare(name, {});
        if (simperium == null)
            return null;

        if (this.get(bn, "null") == null) {
            var bucket = this.set(bn, simperium.bucket(name));
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
                        buckets.authenticate(session("username"), buckets.lastPassword || '-', {});
                    return;
                }

                console.log("got error:", errortype);
            });
            bucket.on('ready', function () {
                var names = buckets(name);
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
    buckets.simperium = null;

    buckets.api_key = document.essential.fluentbook_simperium_api_key;
    buckets.app_id = document.essential.fluentbook_simperium_app_id;
    buckets.authUrl = "https://auth.simperium.com/1/:app_id/authorize/".replace(":app_id", buckets.app_id);
    buckets.createUrl = "https://auth.simperium.com/1/:app_id/create/".replace(":app_id", buckets.app_id);

    buckets.authenticate = function (username, password, opts) {
        function success(data) {
            buckets.lastPassword = password;

            account.BookAccess().message = "";
            session.set("username", data.username);
            session.set("userid", data.userid);
            session.set("access_token", data.access_token);
            session.set("password", buckets.lastPassword == "-");
            state.set("authenticated", true);

            if (opts.success)
                opts.success(data);
        }

        function error(err, tp, code) {
            switch (code) {
                case "BAD REQUEST":
                    account.BookAccess().message = err.responseJSON.message;
                    break;

                case "UNAUTHORIZED":
                    if (err.responseText == "invalid password") {
                        if (opts.invalidPassword)
                            opts.invalidPassword(err, tp, code);
                        session.set("password", true);
                    } else {
                        if (opts.unknown)
                            opts.unknown(err, tp, code);
                    }
                    break;
            }
            if (opts.error)
                opts.error(err, tp, code);
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

    account.OUR_CITIES = {
        "zurich": { code: "zurich", name: "Zürich" }
    };

    account.GEO2CITY = {
        "CH19": account.OUR_CITIES.zurich,
        "CH25": account.OUR_CITIES.zurich
    };

    var state = Resolver("document::essential.state"), basic = Resolver("buckets::user.basic"), session = Resolver("document::essential.session"), geoip = Resolver("document::essential.geoip"), console = Resolver("essential::console::")();

    account.BookAccess = Generator(function () {
        basic.on("bind change", this, function (ev) {
            ev.data.user = basic();
        });
        this.session = session();
        if (this.session.username)
            basic.set("email", this.session.username);
        this.state = state();
        state.on("change", this, function (ev) {
            if (ev.binding || ev.symbol == "authenticated")
                ev.data.updateAuthenticated();
        });
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

        var password = "-";

        buckets.authenticate(this.user.email, password, {
            unknown: function (err, tp, code) {
                buckets.authenticate(this.user.email, password, {
                    create: true,
                    error: function (err, tp, code) {
                        switch (err.status) {
                            case 400:
                                account.BookAccess().message = err.responseJSON.message;

                                break;
                            case 409:
                                break;
                        }

                        console.log("Failed to create user for", this.user.email);
                    }
                });
            }
        });
    };

    account.BookAccess.prototype.updateAuthenticated = function () {
        if (this.state.authenticated) {
            if (buckets.simperium == null) {
                var bucket = buckets.getBucket("user");
            }
        }

        if (!this.state.authenticated) {
            buckets.clear();
            buckets.stop();
            this.forgetUser();
        }
    };

    account.BookAccess.prototype.forgetUser = function () {
        setTimeout(function () {
            basic.set({});
            session.set("username", "");
            session.set("password", false);
        }, 0);
    };

    account.BookAccess.prototype.iLiveIn = function (city) {
        if (account.OUR_CITIES[city])
            this.city = account.OUR_CITIES[city];
    };

    account.BookAccess.prototype.applyPhone = function () {
        if (buckets.simperium) {
            buckets.getBucket("user").update("basic");
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

    function Book(el, config) {
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
    }

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
function enhance_book(el, role, config) {
    var book = new reader.Book(el, config);

    return book;
}

function layout_book(el, layout, instance) {
    if (instance)
        return instance.layout(layout);
}

function discard_book(el, role, instance) {
    if (instance)
        instance.destroy(el);
}

Resolver("page").set("handlers.enhance.book", enhance_book);
Resolver("page").set("handlers.layout.book", layout_book);
Resolver("page").set("handlers.discard.book", discard_book);

Resolver("page").set("handlers.enhance.slider", slider.enhance);
Resolver("page").set("handlers.layout.slider", function (el, layout, instance) {
    if (instance)
        return instance.layout(layout);
});
Resolver("page").set("handlers.discard.slider", function (el, role, instance) {
    if (instance)
        instance.destroy(el);
});

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

    fluentApp.directive('fgChoices', [
        '$compile', function ($compile) {
            var radios = '<label class="" ng-repeat="option in __.options">' + '<input type="radio" name="{{ __.name }}" value="{{ option.value }}">{{ option.text }}</label>';

            function link(scope, jqElement, attrs) {
                var out, langContext = attrs.langContext, __ = {
                    name: attrs.name,
                    options: []
                };
                scope.__ = __;
                for (var e, i = 0; e = jqElement[0][i]; ++i) {
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

document.essential.router.manage({ href: "/log-out" }, "essential.resources", function (ev) {
    Resolver("document").set("essential.state.authenticated", false);
    Resolver("page").set("state.expanded", false);

    return false;
});
