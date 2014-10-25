
module.exports = function (discussModule) {

  'use strict';

  discussModule.config(['$urlRouterProvider', '$locationProvider', function ($urlRouterProvider, $locationProvider) {

    // setup routing
    /*
    $urlRouterProvider
      .when('/', { action: 'home.view' })
      .when('/foo', { action: 'foo.view' })
      .when('/bar', { action: 'bar.view' })
      .when('/tests', { action: 'tests.view' })
      .otherwise({ redirectTo: '/'});
    */

    // use html5 push state
    $locationProvider.html5Mode(true);

  }]);
};
