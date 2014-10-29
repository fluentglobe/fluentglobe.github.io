
// My SocketStream 0.3 app

var http = require('http'),
	path = require('path'),
	less = require('ss-less'),
	amdclean = require('../lib/ss/amdclean'),
    ss = require('socketstream');

ss.client.options.dirs.static = "/site";
ss.client.options.dirs.assets = "/site/assets";
ss.client.options.entryModuleName = '';

ss.session.options.maxAge = 2.6*Math.pow(10,9);

ss.client.assets.send('shims','json.min.js','');
ss.client.assets.send('libs','browserify.js','');

// LESS/SASS config
// less.prependLess('@assets-path: "' + '' + '"');

// Common codepage for all pages
ss.client.define('common', {
	view: 'common.jade',
	code: ['common'],
	tmpl: ['common']
});

// Define a single-page client called 'discuss'
ss.client.define('discuss', {
  view: 'discuss.jade',
  css:  ['discuss.scss'],
  // code: ['app/lesson.es','app/entry.js'],
  code: ['discuss','system'],
  tmpl: ['discuss']
});

// Serve this client on the root URL
ss.http.route('/discuss', function(req, res){
  res.serveClient('discuss');
});


// Define a single-page client called 'my-lesson'
ss.client.define('my-lesson', {
  view: 'my-lesson.jade',
  css:  ['my-lesson.scss'],
  code: ['my-lesson'],
  tmpl: '*'
});

ss.http.route('/my-lesson', function(req,res) {
	res.serveClient('my-lesson');
});

// Jasmine Test Runner
ss.client.define('test', {
	view: 'SpecRunner.jade',
	css: ['libs/test'],
	code: ['libs','tests','app'],
	templ: 'none'
});

ss.http.route('/test', function(req,res) {
	res.serveClient('test');
});

// Code Formatters
ss.client.formatters.add(require('ss-sass'));
ss.client.formatters.add(less);
ss.client.formatters.add(amdclean);

// HTML template formatters
ss.client.formatters.add(require('../lib/ss/jade'),{
    basedir: path.join(__dirname,"../lib"),
	locals: {
		debug: !(ss.env === 'production')
	} // extra variables
	// headers {}
});

// Use server-side compiled Hogan (Mustache) templates. Others engines available
ss.client.templateEngine.use('angular');

// respond with angular content
ss.responders.add(require('../lib/ss/angular/server'),{pollFreq: 1000});

ss.ws.transport.use(require('ss-sockjs'), {
	client: {
		// debug: (ss.env === 'production')
	},
	server: {
		// log: function(severity,message) {
		// 	console.log("custom log:::", severity, message);
		// }
	}
});

// Minimize and pack assets if you type: SS_ENV=production node app.js
if (ss.env === 'production') ss.client.packAssets();
else {
	// var jadeware = require("../lib/util/jadeware");
	// ss.http.middleware.prepend(jadeware({
	// 	debug: true,
	// 	base_dir: path.join(__dirname,".."),
	// 	vars: {},
	// 	src: ss.client.options.dirs.static
	// }));
}

// Start web server
var server = http.Server(ss.http.middleware);
server.listen(3000);

//TODO configurable port
//TODO config SSL

// Start SocketStream
ss.start(server);
