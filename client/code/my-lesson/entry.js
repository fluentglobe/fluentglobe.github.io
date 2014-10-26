// This file automatically gets called first by SocketStream and must always exist

// Make 'ss' available to all modules and the browser console
window.ss = require('socketstream');

require('ssAngular');

require('/filters');
require('/services');
require('/directives');

var discuss = angular.module('discuss', ['ngRoute','ssAngular','discuss.filters','discuss.services','discuss.directives']);

require('/routes')(discuss);
require('/controllers')(discuss);

ss.server.on('disconnect', function(){
  // $('#warning').modal('show');
  console.log('Connection down :-(');
});

ss.server.on('reconnect', function(){
  // $('#warning').modal('hide');
  console.log('Connection back up :-)');
});

ss.server.on('ready', function(){

  // Wait for the DOM to finish loading
  jQuery(function(){
    // nah
  });

});
