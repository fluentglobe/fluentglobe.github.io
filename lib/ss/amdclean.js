// AMD Clean (ES) wrapper for SocketStream 0.3

var fs = require('fs'),
    path = require('path'),
    requirejs = require('requirejs'),
    amdclean = require('amdclean'),
    amdOptimize = require('amd-optimize'),
    MODULES = {
      //TODO blank out already included source
      'angular': path.join(__dirname,'../../client/components/angular/angular.js'),
      'base64': path.join(__dirname,'../../client/components/base64/base64.js'),
      'eventemitter': path.join(__dirname,'../../client/components/eventemitter2/index.js'),
      'eventemitter2': path.join(__dirname,'../../client/components/eventemitter2/index.js'),
      'i18next': path.join(__dirname,'../../client/components/i18next/i18next.js'),
      'uri': path.join(__dirname,'../../client/components/uri.js/src/URI.js')
    };

exports.init = function(root, config) {

  return {

    name: 'EcmaScript',

    extensions: ['es'],

    assetType: 'js',

    contentType: 'text/javascript; charset=utf-8',

    compile: function(filePath, options, cb) {
      var name = path.basename(filePath,'.es');
      var optimized = amdOptimize(name); 
      var input = fs.readFileSync(filePath, 'utf8');
      optimized.write(input,'utf8',function(data) {
        cb(optimized.read(100000));
      });
      return;

      requirejs.optimize({
        'findNestedDependencies': true,
        'baseUrl': path.join(__dirname,'../site'),
        'path': MODULES,
        'optimize': 'none',
        'include': [path],
        'out': path + '.tmp',

        'onModuleBundleComplete': function(data) {
          var outputFile = data.path;

          fs.writeFileSync(outputFile, amdclean.clean({
            'filePath': outputFile
          }));
        }
      });

      var input = fs.readFileSync(path, 'utf8');
      try {
        cb( coffee.compile(input, {bare: true}) );
      } catch (e) {
        var message = "! Error compiling " + path + " into CoffeeScript";
        console.log(String.prototype.hasOwnProperty('red') && message.red || message);
        cb("Error compiling to CoffeeScript: " + e.stack);
        throw new Error(e);
      }
    }
  };
};

/* package.json

{
  "name": "ss-coffee",
  "author": "Owen Barnes <owen@socketstream.org>",
  "description": "CoffeeScript wrapper for SocketStream 0.3",
  "version": "0.1.2",
  "main": "./wrapper.js",
  "repository": {
    "type" : "git",
    "url": "https://github.com/socketstream/ss-coffee.git"
  },
  "engines": {
    "node": ">= 0.6.0"
  },
  "dependencies": {
    "coffee-script": "1.3.x"
  },
  "devDependencies": {}
}

*/