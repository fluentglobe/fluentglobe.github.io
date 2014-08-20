(function() {
  var bucket, simperium,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  bucket = (function() {
    function bucket(s, name, b_opts) {
      var error, val;
      this.s = s;
      this.name = name;
      this._check_pending = __bind(this._check_pending, this);
      this.pending = __bind(this.pending, this);
      this.on_changes = __bind(this.on_changes, this);
      this.retrieve_changes = __bind(this.retrieve_changes, this);
      this._send_changes = __bind(this._send_changes, this);
      this._queue_change = __bind(this._queue_change, this);
      this._make_change = __bind(this._make_change, this);
      this.update = __bind(this.update, this);
      this._check_update = __bind(this._check_update, this);
      this._notify_client = __bind(this._notify_client, this);
      this._index_loaded = __bind(this._index_loaded, this);
      this.on_entity_version = __bind(this.on_entity_version, this);
      this.get_version = __bind(this.get_version, this);
      this.load_versions = __bind(this.load_versions, this);
      this.on_index_error = __bind(this.on_index_error, this);
      this.on_index_page = __bind(this.on_index_page, this);
      this._refresh_store = __bind(this._refresh_store, this);
      this.send = __bind(this.send, this);
      this.on_data = __bind(this.on_data, this);
      this.start = __bind(this.start, this);
      this._remove_entity = __bind(this._remove_entity, this);
      this._save_entity = __bind(this._save_entity, this);
      this._load_data = __bind(this._load_data, this);
      this._verify = __bind(this._verify, this);
      this._load_meta = __bind(this._load_meta, this);
      this.show_data = __bind(this.show_data, this);
      this.on = __bind(this.on, this);
      this.jd = this.s.jd;
      this.options = this.jd.deepCopy(this.s.options);
      for (name in b_opts) {
        if (!__hasProp.call(b_opts, name)) continue;
        val = b_opts[name];
        this.options[name] = val;
      }
      this.chan = this.options['n'];
      this.space = "" + this.options['app_id'] + "/" + this.name;
      this.username = this.options['username'];
      this.namespace = "" + this.username + ":" + this.space;
      this.clientid = null;
      try {
        this.clientid = localStorage.getItem("" + this.namespace + "/clientid");
      } catch (_error) {
        error = _error;
        this.clientid = null;
      }
      if ((this.clientid == null) || this.clientid.indexOf("sjs") !== 0) {
        this.clientid = "sjs-" + this.s.bversion + "-" + (this.uuid(5));
        try {
          localStorage.setItem("" + this.namespace + "/clientid", this.clientid);
        } catch (_error) {
          error = _error;
          console.log("" + this.name + ": couldnt set clientid");
        }
      }
      this.cb_events = ['notify', 'notify_init', 'notify_version', 'local', 'get', 'ready', 'notify_pending', 'error'];
      this.cbs = {};
      this.cb_e = this.cb_l = this.cb_ni = this.cb_np = null;
      this.cb_n = this.cb_nv = this.cb_r = function() {};
      this.initialized = false;
      this.authorized = false;
      this.data = {
        last_cv: 0,
        ccid: this.uuid(),
        store: {},
        send_queue: [],
        send_queue_timer: null
      };
      this.started = false;
      if (!('nostore' in this.options)) {
        this._load_meta();
        this.loaded = this._load_data();
        console.log("" + this.name + ": localstorage loaded " + this.loaded + " entities");
      } else {
        console.log("" + this.name + ": not loading from localstorage");
        this.loaded = 0;
      }
      this._last_pending = null;
      this._send_backoff = 15000;
      this._backoff_max = 120000;
      this._backoff_min = 15000;
      console.log("" + this.namespace + ": bucket created: opts: " + (JSON.stringify(this.options)));
    }

    bucket.prototype.S4 = function() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };

    bucket.prototype.uuid = function(n) {
      var s;
      n = n || 8;
      s = this.S4();
      while (n -= 1) {
        s += this.S4();
      }
      return s;
    };

    bucket.prototype.now = function() {
      return new Date().getTime();
    };

    bucket.prototype.on = function(event, callback) {
      if (__indexOf.call(this.cb_events, event) >= 0) {
        this.cbs[event] = callback;
        switch (event) {
          case 'get':
          case 'local':
            return this.cb_l = callback;
          case 'notify':
            return this.cb_n = callback;
          case 'notify_version':
            return this.cb_nv = callback;
          case 'notify_pending':
            return this.cb_np = callback;
          case 'notify_init':
            return this.cb_ni = callback;
          case 'ready':
            return this.cb_r = callback;
          case 'error':
            return this.cb_e = callback;
        }
      } else {
        throw new Error("unsupported callback event");
      }
    };

    bucket.prototype.show_data = function() {
      var datastr, key, total;
      if (!this.s.supports_html5_storage()) {
        return;
      }
      total = 0;
      for (key in localStorage) {
        if (!__hasProp.call(localStorage, key)) continue;
        datastr = localStorage[key];
        console.log("[" + key + "]: " + datastr);
        total = total + 1;
      }
      return console.log("" + total + " total");
    };

    bucket.prototype._save_meta = function() {
      var error;
      if (!this.s.supports_html5_storage()) {
        return false;
      }
      console.log("" + this.name + ": save_meta ccid:" + this.data.ccid + " cv:" + this.data.last_cv);
      try {
        localStorage.setItem("" + this.namespace + "/ccid", this.data.ccid);
        localStorage.setItem("" + this.namespace + "/last_cv", this.data.last_cv);
      } catch (_error) {
        error = _error;
        return false;
      }
      return true;
    };

    bucket.prototype._load_meta = function() {
      var _base, _base1;
      if (!this.s.supports_html5_storage()) {
        return;
      }
      this.data.ccid = localStorage.getItem("" + this.namespace + "/ccid");
      if ((_base = this.data).ccid == null) {
        _base.ccid = 1;
      }
      this.data.last_cv = localStorage.getItem("" + this.namespace + "/last_cv");
      if ((_base1 = this.data).last_cv == null) {
        _base1.last_cv = 0;
      }
      return console.log("" + this.name + ": load_meta ccid:" + this.data.ccid + " cv:" + this.data.last_cv);
    };

    bucket.prototype._verify = function(data) {
      if (!('object' in data) || !('version' in data)) {
        return false;
      }
      if (this.jd.entries(data['object']) === 0) {
        if ('last' in data && this.jd.entries(data['last']) > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        if (!(data['version'] != null)) {
          return false;
        }
      }
      return true;
    };

    bucket.prototype._load_data = function() {
      var data, error, i, id, key, loaded, p_len, prefix, _i, _ref;
      if (!this.s.supports_html5_storage()) {
        return;
      }
      prefix = "" + this.namespace + "/e/";
      p_len = prefix.length;
      loaded = 0;
      if (localStorage.length === 0) {
        return 0;
      }
      for (i = _i = 0, _ref = localStorage.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        key = localStorage.key(i);
        if ((key != null) && key.substr(0, p_len) === prefix) {
          id = key.substr(p_len, key.length - p_len);
          try {
            data = JSON.parse(localStorage.getItem(key));
          } catch (_error) {
            error = _error;
            data = null;
          }
          if (data == null) {
            continue;
          }
          if (this._verify(data)) {
            data['check'] = null;
            this.data.store[id] = data;
            loaded = loaded + 1;
          } else {
            console.log("ignoring CORRUPT data: " + (JSON.stringify(data)));
            this._remove_entity(id);
          }
        }
      }
      return loaded;
    };

    bucket.prototype._save_entity = function(id) {
      var datastr, error, key, ret_data, store_data;
      if (!this.s.supports_html5_storage()) {
        return false;
      }
      key = "" + this.namespace + "/e/" + id;
      store_data = this.data.store[id];
      datastr = JSON.stringify(store_data);
      try {
        localStorage.setItem(key, datastr);
      } catch (_error) {
        error = _error;
        return false;
      }
      ret_data = JSON.parse(localStorage.getItem(key));
      if (this.jd.equals(store_data, ret_data)) {
        return true;
      } else {
        return false;
      }
    };

    bucket.prototype._remove_entity = function(id) {
      var error, key;
      if (!this.s.supports_html5_storage()) {
        return false;
      }
      key = "" + this.namespace + "/e/" + id;
      try {
        localStorage.removeItem(key);
      } catch (_error) {
        error = _error;
        return false;
      }
      return true;
    };

    bucket.prototype.start = function() {
      var index_query, opts;
      console.log("" + this.space + ": started initialized: " + this.initialized + " authorized: " + this.authorized);
      this.namespace = "" + this.username + ":" + this.space;
      this.started = true;
      this.first = false;
      if (!this.authorized) {
        if (this.s.connected) {
          this.first = true;
          if ('limit' in this.options) {
            index_query = "i:1:::" + this.options['limit'];
          } else {
            index_query = "i:1:::40";
          }
          this.irequest_time = this.now();
          this.index_request = true;
          this.notify_index = {};
          opts = {
            app_id: this.options.app_id,
            token: this.options.token,
            name: this.name,
            clientid: this.clientid,
            build: this.s.bversion
          };
          if (!this.initialized) {
            opts.cmd = index_query;
          }
          this.send("init:" + (JSON.stringify(opts)));
          console.log("" + this.name + ": sent init " + (JSON.stringify(opts)) + " waiting for auth");
        } else {
          console.log("" + this.name + ": waiting for connect");
        }
        return;
      }
      if (!this.initialized) {
        if (!this.first) {
          this.notify_index = {};
          return this._refresh_store();
        }
      } else {
        console.log("" + this.name + ": retrieve changes from start");
        return this.retrieve_changes();
      }
    };

    bucket.prototype.on_data = function(data) {
      var changes, entity, entitydata, evkey, key, key_end, user, version;
      if (data.substr(0, 5) === "auth:") {
        user = data.substr(5);
        if (user === "expired") {
          console.log("auth expired");
          this.started = false;
          if (this.cb_e != null) {
            this.cb_e("auth");
          }
        } else {
          this.username = user;
          this.authorized = true;
          if (this.initialized) {
            return this.start();
          }
        }
      } else if (data.substr(0, 4) === "cv:?") {
        console.log("" + this.name + ": cv out of sync, refreshing index");
        return setTimeout((function(_this) {
          return function() {
            return _this._refresh_store();
          };
        })(this));
      } else if (data.substr(0, 2) === "c:") {
        changes = JSON.parse(data.substr(2));
        if (this.data.last_cv === "0" && changes.length === 0 && !this.cv_check) {
          this.cv_check = true;
          this._refresh_store();
        }
        return this.on_changes(changes);
      } else if (data.substr(0, 2) === "i:") {
        console.log("" + this.name + ":  index msg received: " + (this.now() - this.irequest_time));
        return this.on_index_page(JSON.parse(data.substr(2)));
      } else if (data.substr(0, 2) === "e:") {
        key_end = data.indexOf("\n");
        evkey = data.substr(2, key_end - 2);
        version = evkey.substr(evkey.lastIndexOf('.') + 1);
        key = evkey.substr(0, evkey.lastIndexOf('.'));
        entitydata = data.substr(key_end + 1);
        if (entitydata === "?") {
          return this.on_entity_version(null, key, version);
        } else {
          entity = JSON.parse(entitydata);
          return this.on_entity_version(entity['data'], key, version);
        }
      } else {
        return console.log("unknown message: " + data);
      }
    };

    bucket.prototype.send = function(message) {
      console.log("sending: " + this.chan + ":" + message);
      return this.s.send("" + this.chan + ":" + message);
    };

    bucket.prototype._refresh_store = function() {
      var index_query;
      console.log("" + this.name + ": _refresh_store(): loading index");
      if ('limit' in this.options) {
        index_query = "i:1:::" + this.options['limit'];
      } else {
        index_query = "i:1:::40";
      }
      this.send(index_query);
      this.irequest_time = this.now();
      this.index_request = true;
    };

    bucket.prototype.on_index_page = function(response) {
      var elapsed, item, loaded, mark, now, page_req, _i, _len, _ref;
      now = this.now();
      elapsed = now - this.irequest_time;
      console.log("" + this.name + ": index response time: " + elapsed);
      console.log("" + this.name + ": on_index_page(): index page received, current= " + response['current']);
      console.log(response);
      loaded = 0;
      _ref = response['index'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        this.notify_index[item['id']] = false;
        loaded++;
        setTimeout((function(_this) {
          return function(item) {
            return function() {
              return _this.on_entity_version(item['d'], item['id'], item['v']);
            };
          };
        })(this)(item));
      }
      if (!('mark' in response) || 'limit' in this.options) {
        this.index_request = false;
        if ('current' in response) {
          this.data.last_cv = response['current'];
          this._save_meta();
        } else {
          this.data.last_cv = 0;
        }
        if (loaded === 0) {
          return this._index_loaded();
        }
      } else {
        this.index_request = true;
        console.log("" + this.name + ": index last process time: " + (this.now() - now) + ", page_delay: " + this.options['page_delay']);
        mark = response['mark'];
        page_req = (function(_this) {
          return function(mark) {
            _this.send("i:1:" + mark + "::100");
            return _this.irequest_time = _this.now();
          };
        })(this);
        return setTimeout((function(_this) {
          return function(mark) {
            return function() {
              return page_req(mark);
            };
          };
        })(this)(mark), this.options['page_delay']);
      }
    };

    bucket.prototype.on_index_error = function() {
      return console.log("" + this.name + ": index doesnt exist or other error");
    };

    bucket.prototype.load_versions = function(id, versions) {
      var min, v, _i, _ref, _results;
      if (!(id in this.data.store)) {
        return false;
      }
      min = Math.max(this.data.store[id]['version'] - (versions + 1), 1);
      _results = [];
      for (v = _i = min, _ref = this.data.store[id]['version'] - 1; min <= _ref ? _i <= _ref : _i >= _ref; v = min <= _ref ? ++_i : --_i) {
        console.log("" + this.name + ": loading version " + id + "." + v);
        _results.push(this.send("e:" + id + "." + v));
      }
      return _results;
    };

    bucket.prototype.get_version = function(id, version) {
      var evkey;
      evkey = "" + id + "." + version;
      return this.send("e:" + evkey);
    };

    bucket.prototype.on_entity_version = function(data, id, version) {
      var data_copy, nid, notify_cb, to_load, _ref;
      console.log("" + this.name + ": on_entity_version(" + data + ", " + id + ", " + version + ")");
      if (data != null) {
        data_copy = this.jd.deepCopy(data);
      } else {
        data_copy = null;
      }
      if (this.initialized === false && (this.cb_ni != null)) {
        notify_cb = this.cb_ni;
      } else {
        notify_cb = this.cb_n;
      }
      if (id in this.data.store && 'last' in this.data.store[id] && this.jd.entries(this.data.store[id]['last'])) {
        data_copy = this.jd.deepCopy(this.data.store[id]['last']);
        notify_cb(id, data_copy, null);
        this.notify_index[id] = true;
        return this._check_update(id);
      } else if (id in this.data.store && version < this.data.store[id]['version']) {
        return this.cb_nv(id, data_copy, version);
      } else {
        if (!(id in this.data.store)) {
          this.data.store[id] = {};
        }
        this.data.store[id]['id'] = id;
        this.data.store[id]['object'] = data;
        this.data.store[id]['version'] = parseInt(version);
        notify_cb(id, data_copy, version);
        this.notify_index[id] = true;
        to_load = 0;
        _ref = this.notify_index;
        for (nid in _ref) {
          if (!__hasProp.call(_ref, nid)) continue;
          if (this.notify_index[nid] === false) {
            to_load++;
          }
        }
        if (to_load === 0 && this.index_request === false) {
          return this._index_loaded();
        }
      }
    };

    bucket.prototype._index_loaded = function() {
      console.log("" + this.name + ": index loaded, initialized: " + this.initialized);
      if (this.initialized === false) {
        this.cb_r();
        console.log("" + this.name + ": intialized and ready called");
      }
      this.initialized = true;
      console.log("" + this.name + ": retrieve changes from index loaded");
      return this.retrieve_changes();
    };

    bucket.prototype._notify_client = function(key, new_object, orig_object, diff, version) {
      var c_object, cursor, element, fieldname, new_data, o_diff, offsets, t_diff, t_object;
      console.log("" + this.name + ": _notify_client(" + key + ", " + new_object + ", " + orig_object + ", " + (JSON.stringify(diff)) + ")");
      if (this.cb_l == null) {
        console.log("" + this.name + ": no get callback, notifying without transform");
        this.cb_n(key, new_object, version);
        return;
      }
      c_object = this.cb_l(key);
      t_object = null;
      t_diff = null;
      cursor = null;
      offsets = [];
      if (this.jd.typeOf(c_object) === 'array') {
        element = c_object[2];
        fieldname = c_object[1];
        c_object = c_object[0];
        cursor = this.s._captureCursor(element);
        if (cursor) {
          offsets[0] = cursor['startOffset'];
          if ('endOffset' in cursor) {
            offsets[1] = cursor['endOffset'];
          }
        }
      }
      if ((c_object != null) && (orig_object != null)) {
        o_diff = this.jd.object_diff(orig_object, c_object);
        console.log("client/server version diff: " + (JSON.stringify(o_diff)));
        if (this.jd.entries(o_diff) === 0) {
          console.log("local diff 0 entries");
          t_diff = diff;
          t_object = orig_object;
        } else {
          console.log("o_diff");
          console.log(o_diff);
          console.log("orig_object");
          console.log(orig_object);
          console.log("c_object");
          console.log(c_object);
          console.log("client modified doing transform");
          t_diff = this.jd.transform_object_diff(o_diff, diff, orig_object);
          t_object = new_object;
        }
        if (cursor) {
          new_data = this.jd.apply_object_diff_with_offsets(t_object, t_diff, fieldname, offsets);
          if ((element != null) && 'value' in element) {
            element['value'] = new_data[fieldname];
          }
          cursor['startOffset'] = offsets[0];
          if (offsets.length > 1) {
            cursor['endOffset'] = offsets[1];
            if (cursor['startOffset'] >= cursor['endOffset']) {
              cursor['collapsed'] = true;
            }
          }
          this.s._restoreCursor(element, cursor);
        } else {
          console.log("in regular apply_object_diff");
          console.log("t_object");
          console.log(t_object);
          console.log("t_diff");
          console.log(t_diff);
          new_data = this.jd.apply_object_diff(t_object, t_diff);
        }
        return this.cb_n(key, new_data, version);
      } else if (new_object) {
        return this.cb_n(key, new_object, version);
      } else {
        return this.cb_n(key, null, null);
      }
    };

    bucket.prototype._check_update = function(id) {
      var change, found, s_data, _i, _len, _ref;
      console.log("" + this.name + ": _check_update(" + id + ")");
      if (!(id in this.data.store)) {
        return false;
      }
      s_data = this.data.store[id];
      if (s_data['change']) {
        found = false;
        _ref = this.data.send_queue;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          change = _ref[_i];
          if (change['id'] === s_data['change']['id'] && change['ccid'] === s_data['change']['ccid']) {
            found = true;
          }
        }
        if (!found) {
          this._queue_change(s_data['change']);
          return true;
        }
        return false;
      }
      if (s_data['check'] != null) {
        return false;
      }
      if ('last' in s_data && this.jd.equals(s_data['object'], s_data['last'])) {
        delete s_data['last'];
        this._remove_entity(id);
        return false;
      }
      change = this._make_change(id);
      if (change != null) {
        s_data['change'] = change;
        this._queue_change(change);
      } else {
        this._remove_entity(id);
      }
      return true;
    };

    bucket.prototype.update = function(id, object) {
      var change, s_data, _i, _len, _ref;
      if (arguments.length === 1) {
        if (this.cb_l != null) {
          object = this.cb_l(id);
          if (this.jd.typeOf(object) === 'array') {
            object = object[0];
          }
        } else {
          throw new Error("missing 'local' callback");
        }
      }
      console.log("" + this.name + ": update(" + id + ")");
      if ((id == null) && (object == null)) {
        return false;
      }
      if (id != null) {
        if (id.length === 0 || id.indexOf('/') !== -1) {
          return false;
        }
      } else {
        id = this.uuid();
      }
      if (!(id in this.data.store)) {
        this.data.store[id] = {
          'id': id,
          'object': {},
          'version': null,
          'change': null,
          'check': null
        };
      }
      s_data = this.data.store[id];
      s_data['last'] = this.jd.deepCopy(object);
      s_data['modified'] = this.s._time();
      this._save_entity(id);
      _ref = this.data.send_queue;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        change = _ref[_i];
        if (String(id) === change['id']) {
          console.log("" + this.name + ": update(" + id + ") found pending change, aborting");
          return null;
        }
      }
      if (s_data['check'] != null) {
        clearTimeout(s_data['check']);
      }
      s_data['check'] = setTimeout((function(_this) {
        return function(id, s_data) {
          return function() {
            s_data['check'] = null;
            s_data['change'] = _this._make_change(id);
            delete s_data['last'];
            _this._save_entity(id);
            return _this._queue_change(s_data['change']);
          };
        };
      })(this)(id, s_data), this.options['update_delay']);
      return id;
    };

    bucket.prototype._make_change = function(id) {
      var c_object, change, s_data;
      s_data = this.data.store[id];
      change = {
        'id': String(id),
        'ccid': this.uuid()
      };
      if (!this.initialized) {
        if ('last' in s_data) {
          c_object = s_data['last'];
        } else {
          return null;
        }
      } else {
        if (this.cb_l != null) {
          c_object = this.cb_l(id);
          if (this.jd.typeOf(c_object) === 'array') {
            c_object = c_object[0];
          }
        } else {
          if ('last' in s_data) {
            c_object = s_data['last'];
          } else {
            return null;
          }
        }
      }
      if (s_data['version'] != null) {
        change['sv'] = s_data['version'];
      }
      if (c_object === null && (s_data['version'] != null)) {
        change['o'] = '-';
        console.log("" + this.name + ": deletion requested for " + id);
      } else if ((c_object != null) && (s_data['object'] != null)) {
        change['o'] = 'M';
        if ('sendfull' in s_data) {
          change['d'] = this.jd.deepCopy(c_object);
          delete s_data['sendfull'];
        } else {
          change['v'] = this.jd.object_diff(s_data['object'], c_object);
          if (this.jd.entries(change['v']) === 0) {
            change = null;
          }
        }
      } else {
        change = null;
      }
      return change;
    };

    bucket.prototype._queue_change = function(change) {
      if (change == null) {
        return;
      }
      console.log("_queue_change(" + change['id'] + ":" + change['ccid'] + "): sending");
      this.data.send_queue.push(change);
      this.send("c:" + (JSON.stringify(change)));
      this._check_pending();
      if (this.data.send_queue_timer != null) {
        clearTimeout(this.data.send_queue_timer);
      }
      return this.data.send_queue_timer = setTimeout(this._send_changes, this._send_backoff);
    };

    bucket.prototype._send_changes = function() {
      var change, _i, _len, _ref;
      if (this.data.send_queue.length === 0) {
        console.log("" + this.name + ": send_queue empty, done");
        this.data.send_queue_timer = null;
        return;
      }
      if (!this.s.connected) {
        console.log("" + this.name + ": _send_changes: not connected");
      } else {
        _ref = this.data.send_queue;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          change = _ref[_i];
          console.log("" + this.name + ": sending change: " + (JSON.stringify(change)));
          this.send("c:" + (JSON.stringify(change)));
        }
      }
      this._send_backoff = this._send_backoff * 2;
      if (this._send_backoff > this._backoff_max) {
        this._send_backoff = this._backoff_max;
      }
      return this.data.send_queue_timer = setTimeout(this._send_changes, this._send_backoff);
    };

    bucket.prototype.retrieve_changes = function() {
      console.log("" + this.name + ": requesting changes since cv:" + this.data.last_cv);
      this.send("cv:" + this.data.last_cv);
    };

    bucket.prototype.on_changes = function(response) {
      var change, check_updates, id, idx, new_object, op, orig_object, p, pd, pending, pending_to_delete, reload_needed, s_data, _fn, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref;
      check_updates = [];
      reload_needed = false;
      this._send_backoff = this._backoff_min;
      console.log("" + this.name + ": on_changes(): response=");
      console.log(response);
      for (_i = 0, _len = response.length; _i < _len; _i++) {
        change = response[_i];
        id = change['id'];
        console.log("" + this.name + ": processing id=" + id);
        pending_to_delete = [];
        _ref = this.data.send_queue;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          pending = _ref[_j];
          if (change['clientid'] === this.clientid && id === pending['id']) {
            change['local'] = true;
            pending_to_delete.push(pending);
            check_updates.push(id);
          }
        }
        for (_k = 0, _len2 = pending_to_delete.length; _k < _len2; _k++) {
          pd = pending_to_delete[_k];
          this.data.store[pd['id']]['change'] = null;
          this._save_entity(pd['id']);
          this.data.send_queue = (function() {
            var _l, _len3, _ref1, _results;
            _ref1 = this.data.send_queue;
            _results = [];
            for (_l = 0, _len3 = _ref1.length; _l < _len3; _l++) {
              p = _ref1[_l];
              if (p !== pd) {
                _results.push(p);
              }
            }
            return _results;
          }).call(this);
        }
        if (pending_to_delete.length > 0) {
          this._check_pending();
        }
        if ('error' in change) {
          switch (change['error']) {
            case 412:
              console.log("" + this.name + ": on_changes(): empty change, dont check");
              idx = check_updates.indexOf(change['id']);
              if (idx > -1) {
                check_updates.splice(idx, 1);
              }
              break;
            case 409:
              console.log("" + this.name + ": on_changes(): duplicate change, ignoring");
              break;
            case 405:
              console.log("" + this.name + ": on_changes(): bad version");
              if (change['id'] in this.data.store) {
                this.data.store[change['id']]['version'] = null;
              }
              reload_needed = true;
              break;
            case 440:
              console.log("" + this.name + ": on_change(): bad diff, sending full object");
              this.data.store[id]['sendfull'] = true;
              break;
            default:
              console.log("" + this.name + ": error for last change, reloading");
              if (change['id'] in this.data.store) {
                this.data.store[change['id']]['version'] = null;
              }
              reload_needed = true;
          }
        } else {
          op = change['o'];
          if (op === '-') {
            delete this.data.store[id];
            this._remove_entity(id);
            if (!('local' in change)) {
              this._notify_client(change['id'], null, null, null, null);
            }
          } else if (op === 'M') {
            s_data = this.data.store[id];
            if (('sv' in change && (s_data != null) && (s_data['version'] != null) && s_data['version'] === change['sv']) || !('sv' in change) || (change['ev'] === 1)) {
              if (s_data == null) {
                this.data.store[id] = {
                  'id': id,
                  'object': {},
                  'version': null,
                  'change': null,
                  'check': null
                };
                s_data = this.data.store[id];
              }
              orig_object = this.jd.deepCopy(s_data['object']);
              s_data['object'] = this.jd.apply_object_diff(s_data['object'], change['v']);
              s_data['version'] = change['ev'];
              new_object = this.jd.deepCopy(s_data['object']);
              if (!('local' in change)) {
                this._notify_client(change['id'], new_object, orig_object, change['v'], change['ev']);
              }
            } else if ((s_data != null) && (s_data['version'] != null) && change['ev'] <= s_data['version']) {
              console.log("" + this.name + ": old or duplicate change received, ignoring, change.ev=" + change['ev'] + ", s_data.version:" + s_data['version']);
            } else {
              if (s_data != null) {
                console.log("" + this.name + ": version mismatch couldnt apply change, change.ev:" + change['ev'] + ", s_data.version:" + s_data['version']);
              } else {
                console.log("" + this.name + ": version mismatch couldnt apply change, change.ev:" + change['ev'] + ", s_data null");
              }
              if (s_data != null) {
                this.data.store[id]['version'] = null;
              }
              reload_needed = true;
            }
          } else {
            console.log("" + this.name + ": no operation found for change");
          }
          if (!reload_needed) {
            this.data.last_cv = change['cv'];
            this._save_meta();
            console.log("" + this.name + ": checkpoint cv=" + this.data.last_cv + " ccid=" + this.data.ccid);
          }
        }
      }
      if (reload_needed) {
        console.log("" + this.name + ": reload needed, refreshing store");
        setTimeout((function(_this) {
          return function() {
            return _this._refresh_store();
          };
        })(this));
      } else {
        _fn = (function(_this) {
          return function(id) {
            return setTimeout((function() {
              return _this._check_update(id);
            }), _this.options['update_delay']);
          };
        })(this);
        for (_l = 0, _len3 = check_updates.length; _l < _len3; _l++) {
          id = check_updates[_l];
          _fn(id);
        }
      }
    };

    bucket.prototype.pending = function() {
      var change, x, _i, _len, _ref, _results;
      x = (function() {
        var _i, _len, _ref, _results;
        _ref = this.data.send_queue;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          change = _ref[_i];
          _results.push(change['id']);
        }
        return _results;
      }).call(this);
      console.log("" + this.name + ": pending: " + (JSON.stringify(x)));
      _ref = this.data.send_queue;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        change = _ref[_i];
        _results.push(change['id']);
      }
      return _results;
    };

    bucket.prototype._check_pending = function() {
      var curr_pending, diff, x, _i, _len, _ref;
      if (this.cb_np != null) {
        curr_pending = this.pending();
        diff = true;
        if (this._last_pending) {
          diff = false;
          if (this._last_pending.length === curr_pending.length) {
            _ref = this._last_pending;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              x = _ref[_i];
              if (curr_pending.indexOf(x) === -1) {
                diff = true;
              }
            }
          } else {
            diff = true;
          }
        }
        if (diff) {
          this._last_pending = curr_pending;
          return this.cb_np(curr_pending);
        }
      }
    };

    return bucket;

  })();

  simperium = (function() {
    simperium.prototype.lowerstrip = function(s) {
      s = s.toLowerCase();
      if (String.prototype.trim != null) {
        return s.trim();
      } else {
        return s.replace(/^\s+|\s+$/g, "");
      }
    };

    simperium.prototype._time = function() {
      var d;
      d = new Date();
      return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds()) / 1000;
    };

    simperium.prototype.supports_html5_storage = function() {
      var error;
      try {
        return 'localStorage' in window && window['localStorage'] !== null;
      } catch (_error) {
        error = _error;
        return false;
      }
    };

    function simperium(app_id, options) {
      var name, scheme, val, _ref;
      this.app_id = app_id;
      this.options = options;
      this._restoreCursor = __bind(this._restoreCursor, this);
      this._captureCursor = __bind(this._captureCursor, this);
      this._sock_message = __bind(this._sock_message, this);
      this._sock_hb_check = __bind(this._sock_hb_check, this);
      this._sock_closed = __bind(this._sock_closed, this);
      this._sock_opened = __bind(this._sock_opened, this);
      this._sock_connect = __bind(this._sock_connect, this);
      this.synced = __bind(this.synced, this);
      this.send = __bind(this.send, this);
      this.stop = __bind(this.stop, this);
      this.start = __bind(this.start, this);
      this.on = __bind(this.on, this);
      this.bucket = __bind(this.bucket, this);
      this.bversion = 2014030401;
      this.jd = new jsondiff();
      this.dmp = this.jd.dmp;
      this.auth_token = null;
      this.options = this.options || {};
      this.options['app_id'] = this.app_id;
      this.sock_opts = {
        'debug': false
      };
      if ('sockjs' in this.options) {
        _ref = this.options['sockjs'];
        for (name in _ref) {
          if (!__hasProp.call(_ref, name)) continue;
          val = _ref[name];
          this.sock_opts[name] = val;
        }
      }
      if (!('host' in this.options)) {
        this.options['host'] = 'api.simperium.com';
      }
      if (!('port' in this.options)) {
        this.options['port'] = 80;
      }
      if ('token' in this.options) {
        this.auth_token = this.options['token'];
      }
      if (this.options['host'].indexOf("simperium.com") !== -1) {
        scheme = "https";
      } else {
        scheme = "http";
      }
      this.buckets = {};
      this.channels = 0;
      if (!('update_delay' in this.options)) {
        this.options['update_delay'] = 0;
      }
      if (!('page_delay' in this.options)) {
        this.options['page_delay'] = 0;
      }
      this.options['prefix'] = "sock/1/" + this.app_id;
      this.options['port'] = parseInt(this.options['port']);
      if (this.options['port'] !== 80 && this.options['port'] !== 443) {
        this.sock_url = "" + scheme + "://" + this.options['host'] + ":" + this.options['port'] + "/" + this.options['prefix'];
      } else {
        this.sock_url = "" + scheme + "://" + this.options['host'] + "/" + this.options['prefix'];
      }
      this.stopped = false;
      this._sock_backoff = 3000;
      this._sock_hb = 1;
      this._sock_connect();
    }

    simperium.prototype.bucket = function(name, b_opts) {
      var b;
      name = this.lowerstrip(name);
      b_opts = b_opts || {};
      b_opts['n'] = this.channels++;
      b = new bucket(this, name, b_opts);
      this.buckets[b_opts['n']] = b;
      return b;
    };

    simperium.prototype.on = function(name, event, callback) {
      return this.buckets[name].on(event, callback);
    };

    simperium.prototype.start = function() {
      var b, name, _ref, _results;
      this.stopped = false;
      _ref = this.buckets;
      _results = [];
      for (name in _ref) {
        if (!__hasProp.call(_ref, name)) continue;
        b = _ref[name];
        _results.push(b.start());
      }
      return _results;
    };

    simperium.prototype.stop = function() {
      this.stopped = true;
      if (this.sock != null) {
        return this.sock.close();
      }
    };

    simperium.prototype.send = function(data) {
      return this.sock.send(data);
    };

    simperium.prototype.synced = function() {
      var b, name, _ref;
      _ref = this.buckets;
      for (name in _ref) {
        if (!__hasProp.call(_ref, name)) continue;
        b = _ref[name];
        if (b.pending().length > 0) {
          return false;
        }
      }
      return true;
    };

    simperium.prototype._sock_connect = function() {
      console.log("simperium: connecting to " + this.sock_url);
      this.connected = false;
      this.authorized = false;
      this.sock = new SockJS(this.sock_url, void 0, this.sock_opts);
      this.sock.onopen = this._sock_opened;
      this.sock.onmessage = this._sock_message;
      return this.sock.onclose = this._sock_closed;
    };

    simperium.prototype._sock_opened = function() {
      var b, name, _ref, _results;
      this._sock_backoff = 3000;
      this.connected = true;
      this._sock_hb_timer = setTimeout(this._sock_hb_check, 20000);
      _ref = this.buckets;
      _results = [];
      for (name in _ref) {
        if (!__hasProp.call(_ref, name)) continue;
        b = _ref[name];
        if (b.started) {
          _results.push(b.start());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    simperium.prototype._sock_closed = function() {
      var b, name, _ref;
      this.connected = false;
      _ref = this.buckets;
      for (name in _ref) {
        if (!__hasProp.call(_ref, name)) continue;
        b = _ref[name];
        b.authorized = false;
      }
      console.log("simperium: sock js closed");
      if (this._sock_backoff < 4000) {
        this._sock_backoff = this._sock_backoff + 1;
      } else {
        this._sock_backoff = 15000;
      }
      if (this._sock_hb_timer) {
        clearTimeout(this._sock_hb_timer);
        this._sock_hb_timer = null;
      }
      if (!this.stopped) {
        return setTimeout(this._sock_connect, this._sock_backoff);
      }
    };

    simperium.prototype._sock_hb_check = function() {
      var delay;
      delay = new Date().getTime() - this._sock_msg_time;
      if (this.connected === false) {
        return;
      }
      if (delay > 40000) {
        console.log("simperium: force conn close");
        this.sock.close();
      } else if (delay > 15000) {
        console.log("simperium: send hb " + this._sock_hb);
        this.sock.send("h:" + this._sock_hb);
      }
      return this._sock_hb_timer = setTimeout(this._sock_hb_check, 20000);
    };

    simperium.prototype._sock_message = function(e) {
      var chan, data, error, sep;
      this._sock_msg_time = new Date().getTime();
      data = e.data;
      sep = data.indexOf(":");
      chan = null;
      if (sep === 1 && data.charAt(0) === 'h') {
        this._sock_hb = data.substr(2);
        return;
      }
      try {
        chan = parseInt(data.substr(0, sep));
        data = data.substr(sep + 1);
      } catch (_error) {
        error = _error;
        chan = null;
      }
      if (chan === null) {
        return;
      }
      if (!(chan in this.buckets)) {
        return;
      }
      return this.buckets[chan].on_data(data);
    };

    simperium.prototype._captureCursor = function(element) {};

    simperium.prototype._captureCursor = function(element) {
        if ('activeElement' in element && !element.activeElement) {
            // Safari specific code.
            // Restoring a cursor in an unfocused element causes the focus to jump.
            return null;
        }
        var padLength = this.dmp.Match_MaxBits / 2;    // Normally 16.
        var text = element.value;
        var cursor = {};
        if ('selectionStart' in element) {    // W3
            try {
                var selectionStart = element.selectionStart;
                var selectionEnd = element.selectionEnd;
            } catch (e) {
                // No cursor; the element may be "display:none".
                return null;
            }
            cursor.startPrefix = text.substring(selectionStart - padLength, selectionStart);
            cursor.startSuffix = text.substring(selectionStart, selectionStart + padLength);
            cursor.startOffset = selectionStart;
            cursor.collapsed = (selectionStart == selectionEnd);
            if (!cursor.collapsed) {
                cursor.endPrefix = text.substring(selectionEnd - padLength, selectionEnd);
                cursor.endSuffix = text.substring(selectionEnd, selectionEnd + padLength);
                cursor.endOffset = selectionEnd;
            }
        } else {    // IE
            // Walk up the tree looking for this textarea's document node.
            var doc = element;
            while (doc.parentNode) {
                doc = doc.parentNode;
            }
            if (!doc.selection || !doc.selection.createRange) {
                // Not IE?
                return null;
            }
            var range = doc.selection.createRange();
            if (range.parentElement() != element) {
                // Cursor not in this textarea.
                return null;
            }
            var newRange = doc.body.createTextRange();

            cursor.collapsed = (range.text == '');
            newRange.moveToElementText(element);
            if (!cursor.collapsed) {
                newRange.setEndPoint('EndToEnd', range);
                cursor.endPrefix = newRange.text;
                cursor.endOffset = cursor.endPrefix.length;
                cursor.endPrefix = cursor.endPrefix.substring(cursor.endPrefix.length - padLength);
            }
            newRange.setEndPoint('EndToStart', range);
            cursor.startPrefix = newRange.text;
            cursor.startOffset = cursor.startPrefix.length;
            cursor.startPrefix = cursor.startPrefix.substring(cursor.startPrefix.length - padLength);

            newRange.moveToElementText(element);
            newRange.setEndPoint('StartToStart', range);
            cursor.startSuffix = newRange.text.substring(0, padLength);
            if (!cursor.collapsed) {
                newRange.setEndPoint('StartToEnd', range);
                cursor.endSuffix = newRange.text.substring(0, padLength);
            }
        }

        // Record scrollbar locations
        if ('scrollTop' in element) {
            cursor.scrollTop = element.scrollTop / element.scrollHeight;
            cursor.scrollLeft = element.scrollLeft / element.scrollWidth;
        }

        // alert(cursor.startPrefix + '|' + cursor.startSuffix + ' ' +
        //         cursor.startOffset + '\n' + cursor.endPrefix + '|' +
        //         cursor.endSuffix + ' ' + cursor.endOffset + '\n' +
        //         cursor.scrollTop + ' x ' + cursor.scrollLeft);
        return cursor;
    };

    simperium.prototype._restoreCursor = function(element, cursor) {};

    simperium.prototype._restoreCursor = function(element, cursor) {
        // Set some constants which tweak the matching behaviour.
        // Maximum distance to search from expected location.
        this.dmp.Match_Distance = 1000;
        // At what point is no match declared (0.0 = perfection, 1.0 = very loose)
        this.dmp.Match_Threshold = 0.9;

        var padLength = this.dmp.Match_MaxBits / 2;    // Normally 16.
        var newText = element.value;

        // Find the start of the selection in the new text.
        var pattern1 = cursor.startPrefix + cursor.startSuffix;
        var pattern2, diff;
        var cursorStartPoint = this.dmp.match_main(newText, pattern1,
                cursor.startOffset - padLength);
        if (cursorStartPoint !== null) {
            pattern2 = newText.substring(cursorStartPoint,
                                                                     cursorStartPoint + pattern1.length);
            //alert(pattern1 + '\nvs\n' + pattern2);
            // Run a diff to get a framework of equivalent indicies.
            diff = this.dmp.diff_main(pattern1, pattern2, false);
            cursorStartPoint += this.dmp.diff_xIndex(diff, cursor.startPrefix.length);
        }

        var cursorEndPoint = null;
        if (!cursor.collapsed) {
            // Find the end of the selection in the new text.
            pattern1 = cursor.endPrefix + cursor.endSuffix;
            cursorEndPoint = this.dmp.match_main(newText, pattern1,
                    cursor.endOffset - padLength);
            if (cursorEndPoint !== null) {
                pattern2 = newText.substring(cursorEndPoint,
                                                                         cursorEndPoint + pattern1.length);
                //alert(pattern1 + '\nvs\n' + pattern2);
                // Run a diff to get a framework of equivalent indicies.
                diff = this.dmp.diff_main(pattern1, pattern2, false);
                cursorEndPoint += this.dmp.diff_xIndex(diff, cursor.endPrefix.length);
            }
        }

        // Deal with loose ends
        if (cursorStartPoint === null && cursorEndPoint !== null) {
            // Lost the start point of the selection, but we have the end point.
            // Collapse to end point.
            cursorStartPoint = cursorEndPoint;
        } else if (cursorStartPoint === null && cursorEndPoint === null) {
            // Lost both start and end points.
            // Jump to the offset of start.
            cursorStartPoint = cursor.startOffset;
        }
        if (cursorEndPoint === null) {
            // End not known, collapse to start.
            cursorEndPoint = cursorStartPoint;
        }

        // Restore selection.
        if ('selectionStart' in element) {    // W3
            element.selectionStart = cursorStartPoint;
            element.selectionEnd = cursorEndPoint;
        } else {    // IE
            // Walk up the tree looking for this textarea's document node.
            var doc = element;
            while (doc.parentNode) {
                doc = doc.parentNode;
            }
            if (!doc.selection || !doc.selection.createRange) {
                // Not IE?
                return;
            }
            // IE's TextRange.move functions treat '\r\n' as one character.
            var snippet = element.value.substring(0, cursorStartPoint);
            var ieStartPoint = snippet.replace(/\r\n/g, '\n').length;

            var newRange = doc.body.createTextRange();
            newRange.moveToElementText(element);
            newRange.collapse(true);
            newRange.moveStart('character', ieStartPoint);
            if (!cursor.collapsed) {
                snippet = element.value.substring(cursorStartPoint, cursorEndPoint);
                var ieMidLength = snippet.replace(/\r\n/g, '\n').length;
                newRange.moveEnd('character', ieMidLength);
            }
            newRange.select();
        }

        // Restore scrollbar locations
        if ('scrollTop' in cursor) {
            element.scrollTop = cursor.scrollTop * element.scrollHeight;
            element.scrollLeft = cursor.scrollLeft * element.scrollWidth;
        }
    };

    return simperium;

  })();

  window['Simperium'] = simperium;

  bucket.prototype['on'] = bucket.prototype.on;

  bucket.prototype['start'] = bucket.prototype.start;

  bucket.prototype['load_versions'] = bucket.prototype.load_versions;

  bucket.prototype['pending'] = bucket.prototype.pending;

  simperium.prototype['on'] = simperium.prototype.on;

  simperium.prototype['start'] = simperium.prototype.start;

  simperium.prototype['bucket'] = simperium.prototype.bucket;

  simperium.prototype['synced'] = simperium.prototype.synced;

}).call(this);
