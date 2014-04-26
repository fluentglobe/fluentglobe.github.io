/*! Fluent Globe - v0.1.0 - 2014-04-13
* http://fluentglobe.com
* Copyright (c) 2014 Henrik Vendelbo; Licensed  */
// https://github.com/medialize/URI.js

/* jshint undef: false */

/*!
 * URI.js - Mutating URLs
 *
 * Version: 1.10.0
 *
 * Author: Rodney Rehm
 * Web: http://medialize.github.com/URI.js/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *   GPL v3 http://opensource.org/licenses/GPL-3.0
 *
 */
(function (root, factory) {
    // https://github.com/umdjs/umd/blob/master/returnExports.js
    if (typeof exports === 'object') {
        // Node
        module.exports = factory(require('./punycode'), require('./IPv6'), require('./SecondLevelDomains'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./punycode', './IPv6', './SecondLevelDomains'], factory);
    } else {
        // Browser globals (root is window)
        root.URI = factory(root.punycode, root.IPv6, root.SecondLevelDomains);
    }
}(this, function (punycode, IPv6, SLD) {
"use strict";

function URI(url, base) {
    // Allow instantiation without the 'new' keyword
    if (!(this instanceof URI)) {
        return new URI(url, base);
    }

    if (url === undefined) {
        if (typeof location !== 'undefined') {
            url = location.href + "";
        } else {
            url = "";
        }
    }

    this.href(url);

    // resolve to base according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#constructor
    if (base !== undefined) {
        return this.absoluteTo(base);
    }

    return this;
}

var p = URI.prototype;
var hasOwn = Object.prototype.hasOwnProperty;

function escapeRegEx(string) {
    // https://github.com/medialize/URI.js/commit/85ac21783c11f8ccab06106dba9735a31a86924d#commitcomment-821963
    return string.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}

function getType(value) {
    return String(Object.prototype.toString.call(value)).slice(8, -1);
}

function isArray(obj) {
    return getType(obj) === "Array";
}

function filterArrayValues(data, value) {
    var lookup = {};
    var i, length;

    if (isArray(value)) {
        for (i = 0, length = value.length; i < length; i++) {
            lookup[value[i]] = true;
        }
    } else {
        lookup[value] = true;
    }

    for (i = 0, length = data.length; i < length; i++) {
        if (lookup[data[i]] !== undefined) {
            data.splice(i, 1);
            length--;
            i--;
        }
    }

    return data;
}

//TODO replace with shim? 
function arrayContains(list, value) {
    var i, length;
    
    // value may be string, number, array, regexp
    if (isArray(value)) {
        // Note: this can be optimized to O(n) (instead of current O(m * n))
        for (i = 0, length = value.length; i < length; i++) {
            if (!arrayContains(list, value[i])) {
                return false;
            }
        }
        
        return true;
    }
    
    var _type = getType(value);
    for (i = 0, length = list.length; i < length; i++) {
        if (_type === 'RegExp') {
            if (typeof list[i] === 'string' && list[i].match(value)) {
                return true;
            }
        } else if (list[i] === value) {
            return true;
        }
    }

    return false;
}

function arraysEqual(one, two) {
    if (!isArray(one) || !isArray(two)) {
        return false;
    }
    
    // arrays can't be equal if they have different amount of content
    if (one.length !== two.length) {
        return false;
    }

    one.sort();
    two.sort();

    for (var i = 0, l = one.length; i < l; i++) {
        if (one[i] !== two[i]) {
            return false;
        }
    }
    
    return true;
}

URI._parts = function() {
    return {
        protocol: null,
        username: null,
        password: null,
        hostname: null,
        urn: null,
        port: null,
        path: null,
        query: null,
        fragment: null,
        // state
        duplicateQueryParameters: URI.duplicateQueryParameters
    };
};
// state: allow duplicate query parameters (a=1&a=1)
URI.duplicateQueryParameters = false;
// static properties
URI.protocol_expression = /^[a-z][a-z0-9-+-]*$/i;
URI.idn_expression = /[^a-z0-9\.-]/i;
URI.punycode_expression = /(xn--)/i;
// well, 333.444.555.666 matches, but it sure ain't no IPv4 - do we care?
URI.ip4_expression = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
// credits to Rich Brown
// source: http://forums.intermapper.com/viewtopic.php?p=1096#1096
// specification: http://www.ietf.org/rfc/rfc4291.txt
URI.ip6_expression = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
// gruber revised expression - http://rodneyrehm.de/t/url-regex.html
URI.find_uri_expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;
// http://www.iana.org/assignments/uri-schemes.html
// http://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers#Well-known_ports
URI.defaultPorts = {
    http: "80",
    https: "443",
    ftp: "21",
    gopher: "70",
    ws: "80",
    wss: "443"
};
// allowed hostname characters according to RFC 3986
// ALPHA DIGIT "-" "." "_" "~" "!" "$" "&" "'" "(" ")" "*" "+" "," ";" "=" %encoded
// I've never seen a (non-IDN) hostname other than: ALPHA DIGIT . -
URI.invalid_hostname_characters = /[^a-zA-Z0-9\.-]/;
// encoding / decoding according to RFC3986
function strictEncodeURIComponent(string) {
    // see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/encodeURIComponent
    return encodeURIComponent(string)
        .replace(/[!'()*]/g, escape)
        .replace(/\*/g, "%2A");
}
URI.encode = strictEncodeURIComponent;
URI.decode = decodeURIComponent;
URI.iso8859 = function() {
    URI.encode = escape;
    URI.decode = unescape;
};
URI.unicode = function() {
    URI.encode = strictEncodeURIComponent;
    URI.decode = decodeURIComponent;
};
URI.characters = {
    pathname: {
        encode: {
            // RFC3986 2.1: For consistency, URI producers and normalizers should
            // use uppercase hexadecimal digits for all percent-encodings.
            expression: /%(24|26|2B|2C|3B|3D|3A|40)/ig,
            map: {
                // -._~!'()*
                "%24": "$",
                "%26": "&",
                "%2B": "+",
                "%2C": ",",
                "%3B": ";",
                "%3D": "=",
                "%3A": ":",
                "%40": "@"
            }
        },
        decode: {
            expression: /[\/\?#]/g,
            map: {
                "/": "%2F",
                "?": "%3F",
                "#": "%23"
            }
        }
    },
    reserved: {
        encode: {
            // RFC3986 2.1: For consistency, URI producers and normalizers should
            // use uppercase hexadecimal digits for all percent-encodings.
            expression: /%(21|23|24|26|27|28|29|2A|2B|2C|2F|3A|3B|3D|3F|40|5B|5D)/ig,
            map: {
                // gen-delims
                "%3A": ":",
                "%2F": "/",
                "%3F": "?",
                "%23": "#",
                "%5B": "[",
                "%5D": "]",
                "%40": "@",
                // sub-delims
                "%21": "!",
                "%24": "$",
                "%26": "&",
                "%27": "'",
                "%28": "(",
                "%29": ")",
                "%2A": "*",
                "%2B": "+",
                "%2C": ",",
                "%3B": ";",
                "%3D": "="
            }
        }
    }
};
URI.encodeQuery = function(string) {
    return URI.encode(string + "").replace(/%20/g, '+');
};
URI.decodeQuery = function(string) {
    return URI.decode((string + "").replace(/\+/g, '%20'));
};
URI.recodePath = function(string) {
    var segments = (string + "").split('/');
    for (var i = 0, length = segments.length; i < length; i++) {
        segments[i] = URI.encodePathSegment(URI.decode(segments[i]));
    }

    return segments.join('/');
};
URI.decodePath = function(string) {
    var segments = (string + "").split('/');
    for (var i = 0, length = segments.length; i < length; i++) {
        segments[i] = URI.decodePathSegment(segments[i]);
    }

    return segments.join('/');
};
// generate encode/decode path functions
var _parts = {'encode':'encode', 'decode':'decode'};
var _part;
var generateAccessor = function(_group, _part) {
    return function(string) {
        return URI[_part](string + "").replace(URI.characters[_group][_part].expression, function(c) {
            return URI.characters[_group][_part].map[c];
        });
    };
};

for (_part in _parts) {
    URI[_part + "PathSegment"] = generateAccessor("pathname", _parts[_part]);
}

URI.encodeReserved = generateAccessor("reserved", "encode");

URI.parse = function(string, parts) {
    var pos;
    if (!parts) {
        parts = {};
    }
    // [protocol"://"[username[":"password]"@"]hostname[":"port]"/"?][path]["?"querystring]["#"fragment]

    // extract fragment
    pos = string.indexOf('#');
    if (pos > -1) {
        // escaping?
        parts.fragment = string.substring(pos + 1) || null;
        string = string.substring(0, pos);
    }

    // extract query
    pos = string.indexOf('?');
    if (pos > -1) {
        // escaping?
        parts.query = string.substring(pos + 1) || null;
        string = string.substring(0, pos);
    }

    // extract protocol
    if (string.substring(0, 2) === '//') {
        // relative-scheme
        parts.protocol = '';
        string = string.substring(2);
        // extract "user:pass@host:port"
        string = URI.parseAuthority(string, parts);
    } else {
        pos = string.indexOf(':');
        if (pos > -1) {
            parts.protocol = string.substring(0, pos);
            if (parts.protocol && !parts.protocol.match(URI.protocol_expression)) {
                // : may be within the path
                parts.protocol = undefined;
            } else if (parts.protocol === 'file') {
                // the file scheme: does not contain an authority
                string = string.substring(pos + 3);
            } else if (string.substring(pos + 1, pos + 3) === '//') {
                string = string.substring(pos + 3);

                // extract "user:pass@host:port"
                string = URI.parseAuthority(string, parts);
            } else {
                string = string.substring(pos + 1);
                parts.urn = true;
            }
        }
    }

    // what's left must be the path
    parts.path = string;

    // and we're done
    return parts;
};
URI.parseHost = function(string, parts) {
    // extract host:port
    var pos = string.indexOf('/');
    var bracketPos;
    var t;

    if (pos === -1) {
        pos = string.length;
    }

    if (string.charAt(0) === "[") {
        // IPv6 host - http://tools.ietf.org/html/draft-ietf-6man-text-addr-representation-04#section-6
        // I claim most client software breaks on IPv6 anyways. To simplify things, URI only accepts
        // IPv6+port in the format [2001:db8::1]:80 (for the time being)
        bracketPos = string.indexOf(']');
        parts.hostname = string.substring(1, bracketPos) || null;
        parts.port = string.substring(bracketPos+2, pos) || null;
    } else if (string.indexOf(':') !== string.lastIndexOf(':')) {
        // IPv6 host contains multiple colons - but no port
        // this notation is actually not allowed by RFC 3986, but we're a liberal parser
        parts.hostname = string.substring(0, pos) || null;
        parts.port = null;
    } else {
        t = string.substring(0, pos).split(':');
        parts.hostname = t[0] || null;
        parts.port = t[1] || null;
    }

    if (parts.hostname && string.substring(pos).charAt(0) !== '/') {
        pos++;
        string = "/" + string;
    }

    return string.substring(pos) || '/';
};
URI.parseAuthority = function(string, parts) {
    string = URI.parseUserinfo(string, parts);
    return URI.parseHost(string, parts);
};
URI.parseUserinfo = function(string, parts) {
    // extract username:password
    var pos = string.indexOf('@');
    var firstSlash = string.indexOf('/');
    var t;

    // authority@ must come before /path
    if (pos > -1 && (firstSlash === -1 || pos < firstSlash)) {
        t = string.substring(0, pos).split(':');
        parts.username = t[0] ? URI.decode(t[0]) : null;
        t.shift();
        parts.password = t[0] ? URI.decode(t.join(':')) : null;
        string = string.substring(pos + 1);
    } else {
        parts.username = null;
        parts.password = null;
    }

    return string;
};
URI.parseQuery = function(string) {
    if (!string) {
        return {};
    }

    // throw out the funky business - "?"[name"="value"&"]+
    string = string.replace(/&+/g, '&').replace(/^\?*&*|&+$/g, '');

    if (!string) {
        return {};
    }

    var items = {};
    var splits = string.split('&');
    var length = splits.length;
    var v, name, value;

    for (var i = 0; i < length; i++) {
        v = splits[i].split('=');
        name = URI.decodeQuery(v.shift());
        // no "=" is null according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#collect-url-parameters
        value = v.length ? URI.decodeQuery(v.join('=')) : null;

        if (items[name]) {
            if (typeof items[name] === "string") {
                items[name] = [items[name]];
            }

            items[name].push(value);
        } else {
            items[name] = value;
        }
    }

    return items;
};

URI.build = function(parts) {
    var t = "";

    if (parts.protocol) {
        t += parts.protocol + ":";
    }

    if (!parts.urn && (t || parts.hostname)) {
        t += '//';
    }

    t += (URI.buildAuthority(parts) || '');

    if (typeof parts.path === "string") {
        if (parts.path.charAt(0) !== '/' && typeof parts.hostname === "string") {
            t += '/';
        }

        t += parts.path;
    }

    if (typeof parts.query === "string" && parts.query) {
        t += '?' + parts.query;
    }

    if (typeof parts.fragment === "string" && parts.fragment) {
        t += '#' + parts.fragment;
    }
    return t;
};
URI.buildHost = function(parts) {
    var t = "";

    if (!parts.hostname) {
        return "";
    } else if (URI.ip6_expression.test(parts.hostname)) {
        if (parts.port) {
            t += "[" + parts.hostname + "]:" + parts.port;
        } else {
            // don't know if we should always wrap IPv6 in []
            // the RFC explicitly says SHOULD, not MUST.
            t += parts.hostname;
        }
    } else {
        t += parts.hostname;
        if (parts.port) {
            t += ':' + parts.port;
        }
    }

    return t;
};
URI.buildAuthority = function(parts) {
    return URI.buildUserinfo(parts) + URI.buildHost(parts);
};
URI.buildUserinfo = function(parts) {
    var t = "";

    if (parts.username) {
        t += URI.encode(parts.username);

        if (parts.password) {
            t += ':' + URI.encode(parts.password);
        }

        t += "@";
    }

    return t;
};
URI.buildQuery = function(data, duplicates) {
    // according to http://tools.ietf.org/html/rfc3986 or http://labs.apache.org/webarch/uri/rfc/rfc3986.html
    // being »-._~!$&'()*+,;=:@/?« %HEX and alnum are allowed
    // the RFC explicitly states ?/foo being a valid use case, no mention of parameter syntax!
    // URI.js treats the query string as being application/x-www-form-urlencoded
    // see http://www.w3.org/TR/REC-html40/interact/forms.html#form-content-type

    var t = "";
    var unique, key, i, length;
    for (key in data) {
        if (hasOwn.call(data, key) && key) {
            if (isArray(data[key])) {
                unique = {};
                for (i = 0, length = data[key].length; i < length; i++) {
                    if (data[key][i] !== undefined && unique[data[key][i] + ""] === undefined) {
                        t += "&" + URI.buildQueryParameter(key, data[key][i]);
                        if (duplicates !== true) {
                            unique[data[key][i] + ""] = true;
                        }
                    }
                }
            } else if (data[key] !== undefined) {
                t += '&' + URI.buildQueryParameter(key, data[key]);
            }
        }
    }

    return t.substring(1);
};
URI.buildQueryParameter = function(name, value) {
    // http://www.w3.org/TR/REC-html40/interact/forms.html#form-content-type -- application/x-www-form-urlencoded
    // don't append "=" for null values, according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#url-parameter-serialization
    return URI.encodeQuery(name) + (value !== null ? "=" + URI.encodeQuery(value) : "");
};

URI.addQuery = function(data, name, value) {
    if (typeof name === "object") {
        for (var key in name) {
            if (hasOwn.call(name, key)) {
                URI.addQuery(data, key, name[key]);
            }
        }
    } else if (typeof name === "string") {
        if (data[name] === undefined) {
            data[name] = value;
            return;
        } else if (typeof data[name] === "string") {
            data[name] = [data[name]];
        }

        if (!isArray(value)) {
            value = [value];
        }

        data[name] = data[name].concat(value);
    } else {
        throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");
    }
};
URI.removeQuery = function(data, name, value) {
    var i, length, key;
    
    if (isArray(name)) {
        for (i = 0, length = name.length; i < length; i++) {
            data[name[i]] = undefined;
        }
    } else if (typeof name === "object") {
        for (key in name) {
            if (hasOwn.call(name, key)) {
                URI.removeQuery(data, key, name[key]);
            }
        }
    } else if (typeof name === "string") {
        if (value !== undefined) {
            if (data[name] === value) {
                data[name] = undefined;
            } else if (isArray(data[name])) {
                data[name] = filterArrayValues(data[name], value);
            }
        } else {
            data[name] = undefined;
        }
    } else {
        throw new TypeError("URI.addQuery() accepts an object, string as the first parameter");
    }
};
URI.hasQuery = function(data, name, value, withinArray) {
    if (typeof name === "object") {
        for (var key in name) {
            if (hasOwn.call(name, key)) {
                if (!URI.hasQuery(data, key, name[key])) {
                    return false;
                }
            }
        }
        
        return true;
    } else if (typeof name !== "string") {
        throw new TypeError("URI.hasQuery() accepts an object, string as the name parameter");
    }

    switch (getType(value)) {
        case 'Undefined':
            // true if exists (but may be empty)
            return name in data; // data[name] !== undefined;

        case 'Boolean':
            // true if exists and non-empty
            var _booly = Boolean(isArray(data[name]) ? data[name].length : data[name]);
            return value === _booly;

        case 'Function':
            // allow complex comparison
            return !!value(data[name], name, data);

        case 'Array':
            if (!isArray(data[name])) {
                return false;
            }

            var op = withinArray ? arrayContains : arraysEqual;
            return op(data[name], value);

        case 'RegExp':
            if (!isArray(data[name])) {
                return Boolean(data[name] && data[name].match(value));
            }

            if (!withinArray) {
                return false;
            }

            return arrayContains(data[name], value);

        case 'Number':
            value = String(value);
            /* falls through */
        case 'String':
            if (!isArray(data[name])) {
                return data[name] === value;
            }

            if (!withinArray) {
                return false;
            }

            return arrayContains(data[name], value);

        default:
            throw new TypeError("URI.hasQuery() accepts undefined, boolean, string, number, RegExp, Function as the value parameter");
    }
};


URI.commonPath = function(one, two) {
    var length = Math.min(one.length, two.length);
    var pos;

    // find first non-matching character
    for (pos = 0; pos < length; pos++) {
        if (one.charAt(pos) !== two.charAt(pos)) {
            pos--;
            break;
        }
    }

    if (pos < 1) {
        return one.charAt(0) === two.charAt(0) && one.charAt(0) === '/' ? '/' : '';
    }

    // revert to last /
    if (one.charAt(pos) !== '/') {
        pos = one.substring(0, pos).lastIndexOf('/');
    }

    return one.substring(0, pos + 1);
};

URI.withinString = function(string, callback) {
    // expression used is "gruber revised" (@gruber v2) determined to be the best solution in
    // a regex sprint we did a couple of ages ago at
    // * http://mathiasbynens.be/demo/url-regex
    // * http://rodneyrehm.de/t/url-regex.html

    return string.replace(URI.find_uri_expression, callback);
};

URI.ensureValidHostname = function(v) {
    // Theoretically URIs allow percent-encoding in Hostnames (according to RFC 3986)
    // they are not part of DNS and therefore ignored by URI.js

    if (v.match(URI.invalid_hostname_characters)) {
        // test punycode
        if (!punycode) {
            throw new TypeError("Hostname '" + v + "' contains characters other than [A-Z0-9.-] and Punycode.js is not available");
        }

        if (punycode.toASCII(v).match(URI.invalid_hostname_characters)) {
            throw new TypeError("Hostname '" + v + "' contains characters other than [A-Z0-9.-]");
        }
    }
};

p.build = function(deferBuild) {
    if (deferBuild === true) {
        this._deferred_build = true;
    } else if (deferBuild === undefined || this._deferred_build) {
        this._string = URI.build(this._parts);
        this._deferred_build = false;
    }

    return this;
};

p.clone = function() {
    return new URI(this);
};

p.valueOf = p.toString = function() {
    return this.build(false)._string;
};

// generate simple accessors
_parts = {protocol: 'protocol', username: 'username', password: 'password', hostname: 'hostname',  port: 'port'};
generateAccessor = function(_part){
    return function(v, build) {
        if (v === undefined) {
            return this._parts[_part] || "";
        } else {
            this._parts[_part] = v;
            this.build(!build);
            return this;
        }
    };
};

for (_part in _parts) {                                                                                                                                                                                        
    p[_part] = generateAccessor(_parts[_part]);
}

// generate accessors with optionally prefixed input
_parts = {query: '?', fragment: '#'};
generateAccessor = function(_part, _key){
    return function(v, build) {
        if (v === undefined) {
            return this._parts[_part] || "";
        } else {
            if (v !== null) {
                v = v + "";
                if (v.charAt(0) === _key) {
                    v = v.substring(1);
                }
            }

            this._parts[_part] = v;
            this.build(!build);
            return this;
        }
    };
};

for (_part in _parts) {
    p[_part] = generateAccessor(_part, _parts[_part]);
}

// generate accessors with prefixed output
_parts = {search: ['?', 'query'], hash: ['#', 'fragment']};
generateAccessor = function(_part, _key){
    return function(v, build) {
        var t = this[_part](v, build);
        return typeof t === "string" && t.length ? (_key + t) : t;
    };
};

for (_part in _parts) {
    p[_part] = generateAccessor(_parts[_part][1], _parts[_part][0]);
}

p.pathname = function(v, build) {
    if (v === undefined || v === true) {
        var res = this._parts.path || (this._parts.urn ? '' : '/');
        return v ? URI.decodePath(res) : res;
    } else {
        this._parts.path = v ? URI.recodePath(v) : "/";
        this.build(!build);
        return this;
    }
};
p.path = p.pathname;
p.href = function(href, build) {
    var key;
    
    if (href === undefined) {
        return this.toString();
    }

    this._string = "";
    this._parts = URI._parts();

    var _URI = href instanceof URI;
    var _object = typeof href === "object" && (href.hostname || href.path);

    
    // window.location is reported to be an object, but it's not the sort
    // of object we're looking for: 
    // * location.protocol ends with a colon
    // * location.query != object.search
    // * location.hash != object.fragment
    // simply serializing the unknown object should do the trick 
    // (for location, not for everything...)
    if (!_URI && _object && href.pathname !== undefined) {
        href = href.toString();
    }

    if (typeof href === "string") {
        this._parts = URI.parse(href, this._parts);
    } else if (_URI || _object) {
        var src = _URI ? href._parts : href;
        for (key in src) {
            if (hasOwn.call(this._parts, key)) {
                this._parts[key] = src[key];
            }
        }
    } else {
        throw new TypeError("invalid input");
    }

    this.build(!build);
    return this;
};

// identification accessors
p.is = function(what) {
    var ip = false;
    var ip4 = false;
    var ip6 = false;
    var name = false;
    var sld = false;
    var idn = false;
    var punycode = false;
    var relative = !this._parts.urn;

    if (this._parts.hostname) {
        relative = false;
        ip4 = URI.ip4_expression.test(this._parts.hostname);
        ip6 = URI.ip6_expression.test(this._parts.hostname);
        ip = ip4 || ip6;
        name = !ip;
        sld = name && SLD && SLD.has(this._parts.hostname);
        idn = name && URI.idn_expression.test(this._parts.hostname);
        punycode = name && URI.punycode_expression.test(this._parts.hostname);
    }

    switch (what.toLowerCase()) {
        case 'relative':
            return relative;

        case 'absolute':
            return !relative;

        // hostname identification
        case 'domain':
        case 'name':
            return name;

        case 'sld':
            return sld;

        case 'ip':
            return ip;

        case 'ip4':
        case 'ipv4':
        case 'inet4':
            return ip4;

        case 'ip6':
        case 'ipv6':
        case 'inet6':
            return ip6;

        case 'idn':
            return idn;

        case 'url':
            return !this._parts.urn;

        case 'urn':
            return !!this._parts.urn;

        case 'punycode':
            return punycode;
    }

    return null;
};

// component specific input validation
var _protocol = p.protocol;
var _port = p.port;
var _hostname = p.hostname;

p.protocol = function(v, build) {
    if (v !== undefined) {
        if (v) {
            // accept trailing ://
            v = v.replace(/:(\/\/)?$/, '');

            if (v.match(/[^a-zA-z0-9\.+-]/)) {
                throw new TypeError("Protocol '" + v + "' contains characters other than [A-Z0-9.+-]");
            }
        }
    }
    return _protocol.call(this, v, build);
};
p.scheme = p.protocol;
p.port = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v !== undefined) {
        if (v === 0) {
            v = null;
        }

        if (v) {
            v += "";
            if (v.charAt(0) === ":") {
                v = v.substring(1);
            }

            if (v.match(/[^0-9]/)) {
                throw new TypeError("Port '" + v + "' contains characters other than [0-9]");
            }
        }
    }
    return _port.call(this, v, build);
};
p.hostname = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v !== undefined) {
        var x = {};
        URI.parseHost(v, x);
        v = x.hostname;
    }
    return _hostname.call(this, v, build);
};

// compound accessors
p.host = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v === undefined) {
        return this._parts.hostname ? URI.buildHost(this._parts) : "";
    } else {
        URI.parseHost(v, this._parts);
        this.build(!build);
        return this;
    }
};
p.authority = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v === undefined) {
        return this._parts.hostname ? URI.buildAuthority(this._parts) : "";
    } else {
        URI.parseAuthority(v, this._parts);
        this.build(!build);
        return this;
    }
};
p.userinfo = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v === undefined) {
        if (!this._parts.username) {
            return "";
        }

        var t = URI.buildUserinfo(this._parts);
        return t.substring(0, t.length -1);
    } else {
        if (v[v.length-1] !== '@') {
            v += '@';
        }

        URI.parseUserinfo(v, this._parts);
        this.build(!build);
        return this;
    }
};
p.resource = function(v, build) {
    var parts;
    
    if (v === undefined) {
        return this.path() + this.search() + this.hash();
    }
    
    parts = URI.parse(v);
    this._parts.path = parts.path;
    this._parts.query = parts.query;
    this._parts.fragment = parts.fragment;
    this.build(!build);
    return this;
};

// fraction accessors
p.subdomain = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    // convenience, return "www" from "www.example.org"
    if (v === undefined) {
        if (!this._parts.hostname || this.is('IP')) {
            return "";
        }

        // grab domain and add another segment
        var end = this._parts.hostname.length - this.domain().length - 1;
        return this._parts.hostname.substring(0, end) || "";
    } else {
        var e = this._parts.hostname.length - this.domain().length;
        var sub = this._parts.hostname.substring(0, e);
        var replace = new RegExp('^' + escapeRegEx(sub));

        if (v && v.charAt(v.length - 1) !== '.') {
            v += ".";
        }

        if (v) {
            URI.ensureValidHostname(v);
        }

        this._parts.hostname = this._parts.hostname.replace(replace, v);
        this.build(!build);
        return this;
    }
};
p.domain = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (typeof v === 'boolean') {
        build = v;
        v = undefined;
    }

    // convenience, return "example.org" from "www.example.org"
    if (v === undefined) {
        if (!this._parts.hostname || this.is('IP')) {
            return "";
        }

        // if hostname consists of 1 or 2 segments, it must be the domain
        var t = this._parts.hostname.match(/\./g);
        if (t && t.length < 2) {
            return this._parts.hostname;
        }

        // grab tld and add another segment
        var end = this._parts.hostname.length - this.tld(build).length - 1;
        end = this._parts.hostname.lastIndexOf('.', end -1) + 1;
        return this._parts.hostname.substring(end) || "";
    } else {
        if (!v) {
            throw new TypeError("cannot set domain empty");
        }

        URI.ensureValidHostname(v);

        if (!this._parts.hostname || this.is('IP')) {
            this._parts.hostname = v;
        } else {
            var replace = new RegExp(escapeRegEx(this.domain()) + "$");
            this._parts.hostname = this._parts.hostname.replace(replace, v);
        }

        this.build(!build);
        return this;
    }
};
p.tld = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (typeof v === 'boolean') {
        build = v;
        v = undefined;
    }

    // return "org" from "www.example.org"
    if (v === undefined) {
        if (!this._parts.hostname || this.is('IP')) {
            return "";
        }

        var pos = this._parts.hostname.lastIndexOf('.');
        var tld = this._parts.hostname.substring(pos + 1);

        if (build !== true && SLD && SLD.list[tld.toLowerCase()]) {
            return SLD.get(this._parts.hostname) || tld;
        }

        return tld;
    } else {
        var replace;
        
        if (!v) {
            throw new TypeError("cannot set TLD empty");
        } else if (v.match(/[^a-zA-Z0-9-]/)) {
            if (SLD && SLD.is(v)) {
                replace = new RegExp(escapeRegEx(this.tld()) + "$");
                this._parts.hostname = this._parts.hostname.replace(replace, v);
            } else {
                throw new TypeError("TLD '" + v + "' contains characters other than [A-Z0-9]");
            }
        } else if (!this._parts.hostname || this.is('IP')) {
            throw new ReferenceError("cannot set TLD on non-domain host");
        } else {
            replace = new RegExp(escapeRegEx(this.tld()) + "$");
            this._parts.hostname = this._parts.hostname.replace(replace, v);
        }

        this.build(!build);
        return this;
    }
};
p.directory = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
        if (!this._parts.path && !this._parts.hostname) {
            return '';
        }

        if (this._parts.path === '/') {
            return '/';
        }

        var end = this._parts.path.length - this.filename().length - 1;
        var res = this._parts.path.substring(0, end) || (this._parts.hostname ? "/" : "");

        return v ? URI.decodePath(res) : res;

    } else {
        var e = this._parts.path.length - this.filename().length;
        var directory = this._parts.path.substring(0, e);
        var replace = new RegExp('^' + escapeRegEx(directory));

        // fully qualifier directories begin with a slash
        if (!this.is('relative')) {
            if (!v) {
                v = '/';
            }

            if (v.charAt(0) !== '/') {
                v = "/" + v;
            }
        }

        // directories always end with a slash
        if (v && v.charAt(v.length - 1) !== '/') {
            v += '/';
        }

        v = URI.recodePath(v);
        this._parts.path = this._parts.path.replace(replace, v);
        this.build(!build);
        return this;
    }
};
p.filename = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
        if (!this._parts.path || this._parts.path === '/') {
            return "";
        }

        var pos = this._parts.path.lastIndexOf('/');
        var res = this._parts.path.substring(pos+1);

        return v ? URI.decodePathSegment(res) : res;
    } else {
        var mutatedDirectory = false;
        
        if (v.charAt(0) === '/') {
            v = v.substring(1);
        }

        if (v.match(/\.?\//)) {
            mutatedDirectory = true;
        }

        var replace = new RegExp(escapeRegEx(this.filename()) + "$");
        v = URI.recodePath(v);
        this._parts.path = this._parts.path.replace(replace, v);

        if (mutatedDirectory) {
            this.normalizePath(build);
        } else {
            this.build(!build);
        }

        return this;
    }
};
p.suffix = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
        if (!this._parts.path || this._parts.path === '/') {
            return "";
        }

        var filename = this.filename();
        var pos = filename.lastIndexOf('.');
        var s, res;

        if (pos === -1) {
            return "";
        }

        // suffix may only contain alnum characters (yup, I made this up.)
        s = filename.substring(pos+1);
        res = (/^[a-z0-9%]+$/i).test(s) ? s : "";
        return v ? URI.decodePathSegment(res) : res;
    } else {
        if (v.charAt(0) === '.') {
            v = v.substring(1);
        }

        var suffix = this.suffix();
        var replace;

        if (!suffix) {
            if (!v) {
                return this;
            }

            this._parts.path += '.' + URI.recodePath(v);
        } else if (!v) {
            replace = new RegExp(escapeRegEx("." + suffix) + "$");
        } else {
            replace = new RegExp(escapeRegEx(suffix) + "$");
        }

        if (replace) {
            v = URI.recodePath(v);
            this._parts.path = this._parts.path.replace(replace, v);
        }

        this.build(!build);
        return this;
    }
};
p.segment = function(segment, v, build) {
    var separator = this._parts.urn ? ':' : '/';
    var path = this.path();
    var absolute = path.substring(0, 1) === '/';
    var segments = path.split(separator);

    if (typeof segment !== 'number') {
        build = v;
        v = segment;
        segment = undefined;
    }

    if (segment !== undefined && typeof segment !== 'number') {
        throw new Error("Bad segment '" + segment + "', must be 0-based integer");
    }

    if (absolute) {
        segments.shift();
    }

    if (segment < 0) {
        // allow negative indexes to address from the end
        segment = Math.max(segments.length + segment, 0);
    }

    if (v === undefined) {
        return segment === undefined? segments : segments[segment];
    } else if (segment === null || segments[segment] === undefined) {
        if (isArray(v)) {
            segments = v;
        } else if (v || (typeof v === "string" && v.length)) {
            if (segments[segments.length -1] === "") {
                // empty trailing elements have to be overwritten
                // to prefent results such as /foo//bar
                segments[segments.length -1] = v;
            } else {
                segments.push(v);
            }
        }
    } else {
        if (v || (typeof v === "string" && v.length)) {
            segments[segment] = v;
        } else {
            segments.splice(segment, 1);
        }
    }

    if (absolute) {
        segments.unshift("");
    }

    return this.path(segments.join(separator), build);
};

// mutating query string
var q = p.query;
p.query = function(v, build) {
    if (v === true) {
        return URI.parseQuery(this._parts.query);
    } else if (typeof v === "function") {
        var data = URI.parseQuery(this._parts.query);
        var result = v.call(this, data);
        this._parts.query = URI.buildQuery(result || data, this._parts.duplicateQueryParameters);
        this.build(!build);
        return this;
    } else if (v !== undefined && typeof v !== "string") {
        this._parts.query = URI.buildQuery(v, this._parts.duplicateQueryParameters);
        this.build(!build);
        return this;
    } else {
        return q.call(this, v, build);
    }
};
p.setQuery = function(name, value, build) {
    var data = URI.parseQuery(this._parts.query);
    
    if (typeof name === "object") {
        for (var key in name) {
            if (hasOwn.call(name, key)) {
                data[key] = name[key];
            }
        }
    } else if (typeof name === "string") {
        data[name] = value !== undefined ? value : null;
    } else {
        throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");
    }
    
    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters);
    if (typeof name !== "string") {
        build = value;
    }

    this.build(!build);
    return this;
};
p.addQuery = function(name, value, build) {
    var data = URI.parseQuery(this._parts.query);
    URI.addQuery(data, name, value === undefined ? null : value);
    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters);
    if (typeof name !== "string") {
        build = value;
    }

    this.build(!build);
    return this;
};
p.removeQuery = function(name, value, build) {
    var data = URI.parseQuery(this._parts.query);
    URI.removeQuery(data, name, value);
    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters);
    if (typeof name !== "string") {
        build = value;
    }

    this.build(!build);
    return this;
};
p.hasQuery = function(name, value, withinArray) {
    var data = URI.parseQuery(this._parts.query);
    return URI.hasQuery(data, name, value, withinArray);
};
p.setSearch = p.setQuery;
p.addSearch = p.addQuery;
p.removeSearch = p.removeQuery;
p.hasSearch = p.hasQuery;

// sanitizing URLs
p.normalize = function() {
    if (this._parts.urn) {
        return this
            .normalizeProtocol(false)
            .normalizeQuery(false)
            .normalizeFragment(false)
            .build();
    }

    return this
        .normalizeProtocol(false)
        .normalizeHostname(false)
        .normalizePort(false)
        .normalizePath(false)
        .normalizeQuery(false)
        .normalizeFragment(false)
        .build();
};
p.normalizeProtocol = function(build) {
    if (typeof this._parts.protocol === "string") {
        this._parts.protocol = this._parts.protocol.toLowerCase();
        this.build(!build);
    }

    return this;
};
p.normalizeHostname = function(build) {
    if (this._parts.hostname) {
        if (this.is('IDN') && punycode) {
            this._parts.hostname = punycode.toASCII(this._parts.hostname);
        } else if (this.is('IPv6') && IPv6) {
            this._parts.hostname = IPv6.best(this._parts.hostname);
        }

        this._parts.hostname = this._parts.hostname.toLowerCase();
        this.build(!build);
    }

    return this;
};
p.normalizePort = function(build) {
    // remove port of it's the protocol's default
    if (typeof this._parts.protocol === "string" && this._parts.port === URI.defaultPorts[this._parts.protocol]) {
        this._parts.port = null;
        this.build(!build);
    }

    return this;
};
p.normalizePath = function(build) {
    if (this._parts.urn) {
        return this;
    }

    if (!this._parts.path || this._parts.path === '/') {
        return this;
    }

    var _was_relative;
    var _was_relative_prefix;
    var _path = this._parts.path;
    var _parent, _pos;

    // handle relative paths
    if (_path.charAt(0) !== '/') {
        if (_path.charAt(0) === '.') {
            _was_relative_prefix = _path.substring(0, _path.indexOf('/'));
        }
        _was_relative = true;
        _path = '/' + _path;
    }
    // resolve simples
    _path = _path.replace(/(\/(\.\/)+)|\/{2,}/g, '/');
    // resolve parents
    while (true) {
        _parent = _path.indexOf('/../');
        if (_parent === -1) {
            // no more ../ to resolve
            break;
        } else if (_parent === 0) {
            // top level cannot be relative...
            _path = _path.substring(3);
            break;
        }

        _pos = _path.substring(0, _parent).lastIndexOf('/');
        if (_pos === -1) {
            _pos = _parent;
        }
        _path = _path.substring(0, _pos) + _path.substring(_parent + 3);
    }
    // revert to relative
    if (_was_relative && this.is('relative')) {
        if (_was_relative_prefix){
            _path = _was_relative_prefix + _path;
        } else {
            _path = _path.substring(1);
        }
    }

    _path = URI.recodePath(_path);
    this._parts.path = _path;
    this.build(!build);
    return this;
};
p.normalizePathname = p.normalizePath;
p.normalizeQuery = function(build) {
    if (typeof this._parts.query === "string") {
        if (!this._parts.query.length) {
            this._parts.query = null;
        } else {
            this.query(URI.parseQuery(this._parts.query));
        }

        this.build(!build);
    }

    return this;
};
p.normalizeFragment = function(build) {
    if (!this._parts.fragment) {
        this._parts.fragment = null;
        this.build(!build);
    }

    return this;
};
p.normalizeSearch = p.normalizeQuery;
p.normalizeHash = p.normalizeFragment;

p.iso8859 = function() {
    // expect unicode input, iso8859 output
    var e = URI.encode;
    var d = URI.decode;

    URI.encode = escape;
    URI.decode = decodeURIComponent;
    this.normalize();
    URI.encode = e;
    URI.decode = d;
    return this;
};

p.unicode = function() {
    // expect iso8859 input, unicode output
    var e = URI.encode;
    var d = URI.decode;

    URI.encode = strictEncodeURIComponent;
    URI.decode = unescape;
    this.normalize();
    URI.encode = e;
    URI.decode = d;
    return this;
};

p.readable = function() {
    var uri = this.clone();
    // removing username, password, because they shouldn't be displayed according to RFC 3986
    uri.username("").password("").normalize();
    var t = '';
    if (uri._parts.protocol) {
        t += uri._parts.protocol + '://';
    }

    if (uri._parts.hostname) {
        if (uri.is('punycode') && punycode) {
            t += punycode.toUnicode(uri._parts.hostname);
            if (uri._parts.port) {
                t += ":" + uri._parts.port;
            }
        } else {
            t += uri.host();
        }
    }

    if (uri._parts.hostname && uri._parts.path && uri._parts.path.charAt(0) !== '/') {
        t += '/';
    }

    t += uri.path(true);
    if (uri._parts.query) {
        var q = '';
        for (var i = 0, qp = uri._parts.query.split('&'), l = qp.length; i < l; i++) {
            var kv = (qp[i] || "").split('=');
            q += '&' + URI.decodeQuery(kv[0])
                .replace(/&/g, '%26');

            if (kv[1] !== undefined) {
                q += "=" + URI.decodeQuery(kv[1])
                    .replace(/&/g, '%26');
            }
        }
        t += '?' + q.substring(1);
    }

    t += uri.hash();
    return t;
};

// resolving relative and absolute URLs
p.absoluteTo = function(base) {
    var resolved = this.clone();
    var properties = ['protocol', 'username', 'password', 'hostname', 'port'];
    var basedir, i, p;

    if (this._parts.urn) {
        throw new Error('URNs do not have any generally defined hierachical components');
    }

    if (this._parts.hostname) {
        return resolved;
    }

    if (!(base instanceof URI)) {
        base = new URI(base);
    }

    for (i = 0, p; p = properties[i]; i++) {
        resolved._parts[p] = base._parts[p];
    }
    
    properties = ['query', 'path'];
    for (i = 0, p; p = properties[i]; i++) {
        if (!resolved._parts[p] && base._parts[p]) {
            resolved._parts[p] = base._parts[p];
        }
    }

    if (resolved.path().charAt(0) !== '/') {
        basedir = base.directory();
        resolved._parts.path = (basedir ? (basedir + '/') : '') + resolved._parts.path;
        resolved.normalizePath();
    }

    resolved.build();
    return resolved;
};
p.relativeTo = function(base) {
    var relative = this.clone();
    var properties = ['protocol', 'username', 'password', 'hostname', 'port'];
    var common, _base, _this, _base_diff, _this_diff;

    if (this._parts.urn) {
        throw new Error('URNs do not have any generally defined hierachical components');
    }

    if (!(base instanceof URI)) {
        base = new URI(base);
    }

    if (this.path().charAt(0) !== '/' || base.path().charAt(0) !== '/') {
        throw new Error('Cannot calculate common path from non-relative URLs');
    }

    // determine common sub path
    common = URI.commonPath(relative.path(), base.path());

    // no relation if there's nothing in common 
    if (!common || common === '/') {
        return relative;
    }
    
    // relative paths don't have authority
    for (var i = 0, p; p = properties[i]; i++) {
        relative._parts[p] = null;
    }
    
    _base = base.directory();
    _this = this.directory();

    // base and this are on the same level
    if (_base === _this) {
        relative._parts.path = './' + relative.filename();
        return relative.build();
    }
    
    _base_diff = _base.substring(common.length);
    _this_diff = _this.substring(common.length);
    
    // this is a descendant of base
    if (_base + '/' === common) {
        if (_this_diff) {
            _this_diff += '/';
        }
        
        relative._parts.path = './' + _this_diff + relative.filename();
        return relative.build();
    } 

    // this is a descendant of base
    var parents = '../';
    var _common = new RegExp('^' + escapeRegEx(common));
    var _parents = _base.replace(_common, '/').match(/\//g).length -1;

    while (_parents--) {
        parents += '../';
    }

    relative._parts.path = relative._parts.path.replace(_common, parents);
    return relative.build();
};

// comparing URIs
p.equals = function(uri) {
    var one = this.clone();
    var two = new URI(uri);
    var one_map = {};
    var two_map = {};
    var checked = {};
    var one_query, two_query, key;

    one.normalize();
    two.normalize();

    // exact match
    if (one.toString() === two.toString()) {
        return true;
    }

    // extract query string
    one_query = one.query();
    two_query = two.query();
    one.query("");
    two.query("");

    // definitely not equal if not even non-query parts match
    if (one.toString() !== two.toString()) {
        return false;
    }

    // query parameters have the same length, even if they're permutated
    if (one_query.length !== two_query.length) {
        return false;
    }

    one_map = URI.parseQuery(one_query);
    two_map = URI.parseQuery(two_query);

    for (key in one_map) {
        if (hasOwn.call(one_map, key)) {
            if (!isArray(one_map[key])) {
                if (one_map[key] !== two_map[key]) {
                    return false;
                }
            } else if (!arraysEqual(one_map[key], two_map[key])) {
                return false;
            }

            checked[key] = true;
        }
    }

    for (key in two_map) {
        if (hasOwn.call(two_map, key)) {
            if (!checked[key]) {
                // two contains a parameter not present in one
                return false;
            }
        }
    }

    return true;
};

// state
p.duplicateQueryParameters = function(v) {
    this._parts.duplicateQueryParameters = !!v;
    return this;
};

return URI;
}));
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



angular.module("toggle-switch",["ng"]).directive("toggleSwitch",function(){return{restrict:"EA",replace:!0,scope:{model:"=",disabled:"@",onLabel:"@",offLabel:"@",knobLabel:"@"},template:'<div class="switch" ng-click="toggle()" ng-class="{ \'disabled\': disabled }"><div class="switch-animate" ng-class="{\'switch-off\': !model, \'switch-on\': model}"><span class="switch-left" ng-bind="onLabel"></span><span class="knob" ng-bind="knobLabel"></span><span class="switch-right" ng-bind="offLabel"></span></div></div>',controller:["$scope",function($scope){$scope.toggle=function(){$scope.disabled||($scope.model=!$scope.model)}}],compile:function(element,attrs){attrs.onLabel||(attrs.onLabel="On"),attrs.offLabel||(attrs.offLabel="Off"),attrs.knobLabel||(attrs.knobLabel=" "),attrs.disabled||(attrs.disabled=!1)}}});
!function() {

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

	addEventListeners(this.el,BOOK_EVENTS);

    var ac = ApplicationConfig();
    var page = ac.loadPage(config.src,false,function(ev) { this.book.pageLoad({page:this,book:this.book}); }); //TODO ,false,this,this.pageLoad pass data,page in (event)
	page.book = this;

	if (config.feature) this.el.classList.add("feature");    

	// set up reader if not there
	if (this.reader == undefined) {
		Book.prototype.reader = HTMLElement("div",{
			"append to": document.body,
			"id":"book-reader",
			"make stateful":true});
		Book.prototype.reader.stateful.set("state.hidden",true);
	}

	if (this.article == undefined) {
		Book.prototype.article = document.getElementsByTagName("article")[0];
	}
}

Book.prototype.destroy = function() {
	this.bookEl = null;
	this.pageEl = null;
	this.contentEl = null;
};

Book.prototype.pageLoad = function(ev) {
	var bindingClass = "bk-book";
	if (this.pos && this.pos < 0) bindingClass += " left-" + (-this.pos);
	if (this.pos && this.pos > 0) bindingClass += " right-" + this.pos;

	var page = ev.page, book = ev.book,
		header = ev.page.body.querySelector("body > header"),
		footer = ev.page.body.querySelector("body > footer"),
		title = ev.page.head.querySelector("title"),
		author = ev.page.head.querySelector("meta[name=author]");
		bindingEl = this.bookEl = HTMLElement("div",{"class": bindingClass});

	if (header) {
		var frontEl = HTMLElement("div",{"class":"bk-front","append to":bindingEl},
			'<div class="bk-cover">','</div>',
			'<div class="bk-cover-back">','</div>');

		for(var i=0,c; c = header.childNodes[i]; ++i) if (c.nodeType == 1) {
			frontEl.firstChild.appendChild(c)
		}		
	}
	else this.warning = "No cover"; //TODO fallback behave?

	if (footer) {
		var backEl = HTMLElement("div",{"class":"bk-back","append to":bindingEl});

		for(var i=0,c; c = footer.childNodes[i]; ++i) if (c.nodeType == 1) {
			backEl.appendChild(c)
		}		
	}

	this.pageEl = HTMLElement("div",{"class":"bk-page", "append to":bindingEl });
	//TODO render template with overview

	bindingEl.appendChild( HTMLElement("div",{"class":"bk-top"}) );
	bindingEl.appendChild( HTMLElement("div",{"class":"bk-bottom"}) );
	bindingEl.appendChild( HTMLElement("div",{"class":"bk-right"}) );
	HTMLElement("div",{"class":"bk-left", "append to":bindingEl},"<h2>",
		"<span>", title? title.firstChild.nodeValue.split("|")[0] : "", "</span>",
		"<span>", author? author.getAttribute("content") : "", "</span>",
		"</h2>" );

	ev.book.el.appendChild(bindingEl);

	// ev.book.transformBase = this.bookEl.style[this.prefixedTransform] || this.bookEl.style.transform;

	//var bookEl = this.el.children[0];

	ev.book._createReaderElement(ev.page.body.querySelector("article"));
};

Book.prototype._createReaderElement = function(article) {

	this.contentEl = HTMLElement("div",{
		"class":"book-content","make stateful":true
	});
	this.contentEl.stateful.set("state.hidden",true);

	for(var i=0,c; c = article.childNodes[i]; ++i) if (c.nodeType == 1) {
		this.contentEl.appendChild(c);
	}

	this.reader.appendChild(this.contentEl);
};

var openBook = {

};

Book.prototype.startOpen = function() {

	this.stateful.set("state.collapsed",false);
	this.stateful.set("state.expanding",true); 
	this.stateful.set("state.collapsing",false);

	// var marginTop = parseInt(this.article.style.marginTop);
	// openBook.scrollY = window.scrollY;
	// openBook.marginTop = marginTop;
	// this.article.style.marginTop = (marginTop - openBook.scrollY) + "px";
	// window.scrollTo(0,0);
	pageResolver.set("state.open-book",true);

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
	// this.article.style.marginTop = openBook.marginTop+"px"; //TODO tie with dynamic code
	// window.scrollTo(0,openBook.scrollY);

	this.hideContent();
};

Book.prototype.click = function(ev) {

	// if (ev.target == this.pageEl) {
	// 	this.showContent();
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

Book.prototype.showContent = function() {
	/*
	var placement = ElementPlacement(this.pageEl);
	// debugger;
	this.contentEl.style.left = this.pageEl.offsetLeft + "px";
	this.contentEl.style.right = (this.pageEl.offsetLeft+this.pageEl.offsetWidth) + "px";
	this.contentEl.style.top = this.pageEl.offsetTop + "px";
	this.contentEl.style.bottom = (this.pageEl.offsetTop+this.pageEl.offsetHeight) + "px";
	*/
	this.contentEl.stateful.set("state.hidden",false);
	this.reader.stateful.set("state.hidden",false);
};

Book.prototype.hideContent = function() {

	this.contentEl.stateful.set("state.hidden",true);
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

var bookSupported = false;
function ensureOpenBookSupport() {
	pageResolver.set("map.class.state.open-book","open-book");
	pageResolver.set("state.open-book",false);
	pageResolver.on("true","state.open-book",this,function(ev) {
		// scrollTo(0,0);
		//TODO animated move there by shifting to positioning
		// when resetting switch back to scroll offset
	});
	bookSupported = true;
}

function enhance_book(el,role,config) {
	if (!bookSupported) ensureOpenBookSupport();
    var book = new Book(el,config);
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


Generator(function() {

	this.books = $( '#bookshelf > li > div.bk-book' );
	this.width = this.books.parent().parent().width();


	that.books.each( function( i ) { 
		
		var $book = $( this ),
			$other = that.books.not( $book ),
			$parent = $book.parent(),
			$page = $book.children( 'div.bk-page' ),
			$content = $page.children( 'div.bk-content' ), current = 0;


		if( $content.length > 1 ) {

			var $navPrev = $( '<span class="bk-page-prev">&lt;</span>' ),
				$navNext = $( '<span class="bk-page-next">&gt;</span>' );
			
			$page.append( $( '<nav></nav>' ).append( $navPrev, $navNext ) );

			$navPrev.on( 'click', function() {
				if( current > 0 ) {
					--current;
					$content.removeClass( 'bk-content-current' ).eq( current ).addClass( 'bk-content-current' );
				}
				return false;
			} );

			$navNext.on( 'click', function() {
				if( current < $content.length - 1 ) {
					++current;
					$content.removeClass( 'bk-content-current' ).eq( current ).addClass( 'bk-content-current' );
				}
				return false;
			} );

		}
		
	} );

});
!function() {
  var HTMLElement = Resolver("essential::HTMLElement::");

var speakControllers = angular.module('speakControllers',[]);

// speakControllers.controller()

function ShelfController($scope) {
  var ngView = document.querySelector("[ng-view]");
  HTMLElement.query(ngView).withBranch().queue();
} 

function PickBookController($scope,$routeParams) {
  var ngView = document.querySelector("[ng-view]");
  HTMLElement.query(ngView).withBranch().queue();
}

function EnableBookController($scope,$routeParams) {
  // $routeParams.key name
}

speakControllers
  // .controller('SpeakController',SpeakController)
  .controller('ShelfController',['$scope',ShelfController])
  .controller('PickBookController',['$scope','$routeParams',PickBookController])
  .controller('EnableBookController',['$scope','$routeParams',EnableBookController]);

}();

!function() {

/* jshint -W064: false */

var essential = Resolver("essential"),
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
	DialogAction = Resolver("essential")("DialogAction");

if (! /PhantomJS\//.test(navigator.userAgent)) {
    Resolver("page").set("map.class.state.online","online");
    Resolver("page").set("map.class.notstate.online","offline");
    Resolver("page").set("map.class.notstate.connected","disconnected");
}

if (window.angular) {

    var browseApp = angular.module('browseApp', []); // 'toggle-switch'
    browseApp.config(['$interpolateProvider', function($interpolateProvider) {
          return $interpolateProvider.startSymbol('{(').endSymbol(')}');
        }
    ]);

    browseApp.controller("add-review",['$scope', function($scope) {
        $scope.device = 'off';//'iPad';
    }]);

}

function Navigation(el,config) {
    this.stateful = el.stateful;

    addEventListeners(el, {
        // "change": form_input_change,
        "click": dialog_button_click
    },false);

    var config, items = el.querySelectorAll("[role=menuitem]");
    for(var i=0,item; item = items[i]; ++i) {
        config = Resolver.config(item);
        if (config.select) {
            this.stateful.on("change",config.select,{config:config,el:item},
                function(ev) {
                    if (ev.value == ev.data.config.value) {
                        ev.data.el.stateful.set("state.selected",true);
                    } else {
                        ev.data.el.stateful.set("state.selected",false);
                    }
                });
            if (item.stateful(config.select,"false") == config.value) item.stateful.set("state.selected",true);
        }        
    }
}

Navigation.prototype.destroy = function() {

};

Navigation.prototype.click = function(ev) {

    if (ev.commandRole == "menuitem") {
        var config = Resolver.config(ev.commandElement);
        if (config.select) {
            this.stateful.set(config.select,config.value);
        }
        
        // model.language
        // ev.commandElement.stateful.set("state.selected",true);
    }
};

function dialog_button_click(ev) {
    ev = MutableEvent(ev).withActionInfo();

    if (ev.commandRole == "button") return; // skip the show-menu

    if (ev.commandElement) {
        if (ev.stateful && ev.stateful("state.disabled")) return; // disable
        if (ev.ariaDisabled) return; //TODO fold into stateful

        EnhancedDescriptor.all[this.uniqueID].instance.click(ev);
        ev.stopPropagation();
    }

    if (ev.defaultPrevented) return false;
}


function enhance_navigation(el,role,config) {
    var navigation = new Navigation(el,config);
    return navigation;
}

function layout_navigation(el,layout,instance) {

}

function discard_navigation(el,role,instance) {
    if (instance) instance.destroy(el);
}

Resolver("page").set("handlers.enhance.navigation", enhance_navigation);
Resolver("page").set("handlers.layout.navigation", layout_navigation);
Resolver("page").set("handlers.discard.navigation", discard_navigation);


// --

var FormAction = Generator(function(action) {
},DialogAction);

DialogAction.variant("client+http://email.fluentglobe.com",FormAction);

FormAction.prototype["next-what-for"] = function(el,ev) {
	ev.commandElement.type = "button";
    switch(el.stateful("model.what-for")) {
        case "holiday": case "business":
            //el.stateful("state.stage","=","go-where");
            el.stateful.set("state.stage","go-where");
            break;

        case "family":
            //el.stateful("state.stage","=","only-language");
            el.stateful.set("state.stage","only-language");
            break;

        case "correspondence":
        case "other":
            //el.stateful("state.stage","=","how-often");
            el.stateful.set("state.stage","how-often");
            break
    }
};

FormAction.prototype["next-go-where"] = function(el,ev) {
	ev.commandElement.type = "button";
    //el.stateful("state.stage","=","only-language");
    el.stateful.set("state.stage","how-often");
};

FormAction.prototype["next-only-language"] = function(el,ev) {
	ev.commandElement.type = "button";
    //el.stateful("state.stage","=","how-often");
    el.stateful.set("state.stage","how-often");
};

FormAction.prototype["next-how-often"] = function(el,ev) {
	ev.commandElement.type = "button";
    switch(el.stateful("model.how-often")) {
        case "tfwork":
            el.stateful.set("state.stage","tfwork");
            break;
        default:
            el.stateful.set("state.stage","request");
            break;
    }
    //el.stateful("state.stage","=","completed");
};

FormAction.prototype["next-tfwork"] = function(el,ev) {
	ev.commandElement.type = "button";
    //el.stateful("state.stage","=","how-often");
    el.stateful.set("state.stage","request");
};

FormAction.prototype["next-request"] = function(el,ev) {
    var pageState = document.body.stateful("state");
    if (pageState.online && pageState.connected) {
    	//this.host = "henriks-air.local:3000";
    	this.onsuccess = function(ev) {
            //el.stateful("state.stage","=","completed");
            el.stateful.set("state.stage","completed");
            //console.log("Request",el.stateful(["model"]),"undefined");
        };
        this.onerror = function(ev) {

        };
    }
};

FormAction.prototype["start-over"] = function(el,ev) {
    ev.commandElement.type = "button";
    el.stateful.set("state.stage","what-for");
};

/*
    Widget mode tracking


          var starts=1;
          var exists=0;
          
           function update() {
            document.getElementById('open').innerHTML = 'Starts = '+starts;
            document.getElementById('closed').innerHTML = 'Exists = '+exists;
          };
                   
          widget.pauseAudioVisual = function() {
            exists++;
            update();
          };
    
          widget.didEnterWidgetMode = function(x) {
            starts++;
            update();
          };
  

        widget.notifyContentExited = function() {
    
        }

*/


// section level
Layouter.variant("paged-section",Generator(function(key,el,conf) {
    this.el = el;
    this.gapY = conf.gap || 0;
    this.sizing = el.stateful("sizing");
    this.columns = []; // zero based, 1 less than .no
    
    switch(navigator.platform) {
	    case "iPad":
	    case "iPhone":
	    case "iPod":
	    	this._iosNativeYoutube(el,el.querySelectorAll('video'));
	    	break;
	    default:
	    	this._mediaElementPlayer($('video',el));
	    	break;
    }

},Layouter,{ prototype: {

	"_iosNativeYoutube": function(list) {
		for(var i=0,c; c = list[i]; ++i) {
			var srcEl = c.querySelector("source");
			if (srcEl && srcEl.getAttribute("type") == "video/youtube") {

				//TODO make this inserting work!!!
				var shim = HTMLElement("div",{ "class":"videoapp" });
				c.parentNode.insertBefore(shim, c);
/*
				var obj = HTMLElement("object",
					'<param name="movie" ',
					'value="', c.getAttribute("src"),'"',
					'></param>',
					'<embed type="application/x-shockwave-flash" ',
					'src="', c.getAttribute("src"),'"',
					'></embed>'
					);
				c.parentNode.replaceChild(obj, c);
*/
			}
		}	
	},
	
	"_mediaElementPlayer": function(q) {
		
	    q.mediaelementplayer({
		    iPhoneUseNativeControls:true,
		    iPadUseNativeControls:true
	    });
	},

    "init": function(el,conf,sizing,layout) {
        var col = 0, existing = false, column, columns = [], 
            placement = ElementPlacement(el.firstChild,["breakBefore","breakAfter"],false);

        while(el.firstChild && el.firstChild.laidoutPage == undefined) {
        	var fc = el.firstChild;
        	
        	// only elements can break
            if (fc.tagName !== undefined) {
                placement.compute(fc);
	            var fcf = fc.firstChild, breaks = {
	            	before: placement.style["breakBefore"],
	            	after: placement.style["breakAfter"]
	            };

            	// forced break
            	switch (breaks.before) {
	            	case "column":
	            	case "page":
	            	case "always":
	            		existing = false;
	            		break;
            	}

				// single br tag nested in p tag
            	if (breaks.after == "auto" && fcf && fcf == fc.lastChild && fcf.tagName == "BR") {
            		breaks.after = fcf.className;
            		fc.parentNode.removeChild(fc);
					fc = fcf;           		
            	}
            	
            	// forced break
            	switch (breaks.after) {
	            	case "column":
	            	case "page":
	            	case "always":
	            		existing = false;
	            		column.appendChild(fc);
	            		fc = null;
	            		break;
            	}
            }

            if (!existing) {
	            if (column) column.hardEnd = true;
                column = this.getColumn(++col);
                columns.push(column);
                existing = true;
            }

            if (fc) column.appendChild(fc);
        }

        var descs = DescriptorQuery(columns);
        descs.enhance();

    },

    //TODO "destroy" destroy paged sections

    "_addColumn": function(no) {
        var pageEl = HTMLElement("div", { 
            //"class": "column c"+no,
            "data-role": { 'laidout':'section-column','no':no },
            "append to": this.el,
            "enhance element": true
        });
        pageEl.laidoutPage = true;

        return pageEl;
    },
    
    "insertColumn": function(no) {
    	var next = this._addColumn(no);
    	this.el.insertBefore(next, this.columns[no-1]);
		this.columns.splice(no-1, 0, next);
		for(var i=no,c; c = this.columns[i]; ++i) {
			c.laidout.updateNo(c,i+1);
		}    

        return this.columns[no-1];
    },

    "getColumn": function(no) {
        if (this.columns[no-1] == undefined) {
            this.columns[no-1] = this._addColumn(no);
        } 
        return this.columns[no-1];
    },

    "layout":function(el,layout,sizingEls) {

        for(var i = 0, c; c = sizingEls[i]; ++i) {
            var sizing = c.stateful("sizing");
            // switch()
        }
    }
}}));

Layouter.variant("shifted-article",Generator(
    function(key,el,conf) {
        console.log("shifted",conf);
    },
    Laidout,
    {"prototype":{

        "layout": function(el,layout) {
            console.log(layout);
        }
    }}
));



Laidout.variant("section-column",Generator(
    function(key,el,conf,layouter) {
        this.layouter = layouter;
        this.no = conf.no;
        this.updateNo(el,this.no);
        this.gapY = conf.gap || layouter.gapY || 0;
        this.hardEnd = false;
        this.placement = ElementPlacement(el,["breakBefore","breakAfter"],false);
        this.placement.manually(["paddingTop","paddingBottom"]);
        this.paddingY = parseInt(this.placement.style.paddingTop) + parseInt(this.placement.style.paddingBottom);
        console.debug("col="+this.no,"padding="+this.paddingY);
        this.lineHeight = 12; //TODO measure
    },
    Laidout,
    {"prototype":{

        "calcSizing":function(el,sizing) {
            // contentHeight should be the sum heights by auto

            //TODO could sum up the heights of the content
        },

        "layout": function(el,layout) {
            if (layout.contentHeight > layout.height) {
                // spill to next
                this._spillOverLinear(el,layout);
            }
            else {
                if (! this.hardEnd) {
                    this._pullIn(el,layout);
                }   
            }

        },
        
        "updateNo": function(el,no) {
			this.no = no;
			el.className = "column c"+this.no;	    	    
        },
        
        "_breakRules": function(el) {
	        
            this.placement.compute(el);
            var breaks = {
            	before: this.placement.style["breakBefore"],
            	after: this.placement.style["breakAfter"]
            };
            if (el.tagName == "BR" && breaks.after == "always") switch(el.className) {
	            case "page":
	            case "column":
	            	breaks.after = el.className;
	            	break;
            }
            
            return breaks;
        },
        
        "_whiteSpace": /^\s*$/,
        
        "_guessTextHeight": function(node) {
        	var text = node.data || node.nodeValue;
	    	return this._whiteSpace.test(text)? this.lineHeight : 0;    
        },
        
        "_pullIn": function(el,layout) {
            // look forward to see if there is a block to pull in
            //TODO find columns in bundle without hardEnds and re-split
        },
        
        "_spillOverBisect": function(el,layout) {

	        
        },
        
        "_spillOverLinear": function(el,layout) {

            var toMove = [], breakNow = false, avoidBreakNext = false,
            	height = el.clientHeight, allowBreakBefore;
            var usedHeight = 0, maxCH = height - this.paddingY - this.gapY;

            //console.debug("layout column",this.no,layout,"h="+maxCH,"oh="+layout.height,"p="+this.paddingY);

            this.hardEnd = false;

			// run to find the place to break
            for(var cn=el.childNodes, i=0,c; c = cn[i]; ++i) {

                var elHeight = c.offsetHeight || this._guessTextHeight(c), 
                	elTop = c.offsetTop, 
                	elBottom = (elTop? elTop : usedHeight) + elHeight;
                var breaks = this._breakRules(c);
                //console.debug("elh="+elHeight,"elb="+elBottom,"used="+usedHeight,breakNow?"break now":"",c);

				switch(breaks.before) {
/*
					case "always":
					case "page":
					case "column":
		                breakNow = true;
		                this.hardEnd = true;
						break;

*/
					case "avoid":
						//TODO
						break;
						
					case "auto":
						if (!avoidBreakNext && elBottom > maxCH) breakNow = true;
						
						// the one before and this one isn't disabling a break
						if (!avoidBreakNext && !breakNow) allowBreakBefore = c;
						break;
				}
				

                if (!breakNow) usedHeight = elBottom;
                else {
	                for(var spill=allowBreakBefore; spill; spill = spill==c? null:spill.nextSibling) {
		                toMove.push(spill);
	                }
                }

				avoidBreakNext = false;
				
                switch(breaks.after) { 
/*
					case "always":
					case "page":
					case "column":
		                breakNow = true;
		                this.hardEnd = true;
		                break;
*/
		            case "avoid":
						avoidBreakNext = true;
		            	break;
                } 
            }
            
            //TODO split the spillover and flag the others as done.

			// move overspill elements to next column, last-first
            if (toMove.length) {

                var nextColumn = this.layouter.getColumn(this.no + 1);
                //TODO add page if last
                if (nextColumn.hardEnd) {
	                nextColumn = this.layouter.insertColumn(this.no + 1);
                }

                while(toMove.length) nextColumn.insertBefore(toMove.pop(),nextColumn.firstChild);
            }
        }

    }}
));



}();