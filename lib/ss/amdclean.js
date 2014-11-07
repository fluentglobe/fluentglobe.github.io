// AMD Clean (ES) wrapper for SocketStream 0.3

var fs = require('fs'),
    path = require('path'),
    amdclean = require('amdclean'),
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
  // root = project root
  var cleanOptions = {
    'wrap': {
      'start': '',
      'end': ''
    },

    'escodegen': {
      'format': {
        'compact': false // not on single line
      }
    }
  };

  return {

    name: 'EcmaScript',

    extensions: ['es'],

    assetType: 'js',

    contentType: 'text/javascript; charset=utf-8',

    compile: function(filePath, options, cb) {
      fs.readFile(filePath,{ encoding:"utf8" },function(err,content) {
        if (err) return cb(err);

        // debugger;
        var clean = amdclean.clean(content,cleanOptions);
        //TODO more processing?
        cb(clean);
      });
      /*
      var result = [];
      var name = path.basename(filePath,'.js');
      var optimized = amdOptimize(name);//,options);
      var stream = vinylfs.src(filePath.replace(name,"** /*")).pipe(optimized);
      stream.on('data',function(file) {
        // if (file.relative)
        result.push( file.contents.toString("utf8") );
      });
      stream.on('end',function() {
        console.log("ES out",arguments,result);
        cb(result.join(""));
      }); 
*/
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