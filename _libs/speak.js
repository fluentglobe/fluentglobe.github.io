require('../bower_components/angular-route/angular-route.js');
var books = require('../bower_components/fluent-books/controllers.js');

var speakApp = angular.module('speakApp', ['ngRoute','speakControllers']);
speakApp.config(['$interpolateProvider', function($interpolateProvider) {
      return $interpolateProvider.startSymbol('{(').endSymbol(')}');
    }
]);

!function() {

function SpeakController($scope) {
  $scope.books = [
    { 'name':'Recipes for Visiting Brazil'},
    { 'name':'Introduction to Portuguese' },
    { 'name':'Speak English in London'},
    { 'name':'Introduction to English' }
  ];
}
  
speakApp.controller('SpeakController',SpeakController)

speakApp.config(['$routeProvider','$locationProvider',
  function($routeProvider,$locationProvider) {
    $routeProvider.
      when('/shelf', {
        // template: "-- shelf --",
        templateUrl: '/partials/shelf.html',
        controller: 'ShelfController'
      }).
      // when('/pick/:name', {
      //   templateUrl: '/partials/pick-book.html',
      //   controller: 'PickBookController'
      // }).
      // when('/enable/:key/:name', {
      //   templateUrl: '/partials/enable-book.html',
      //   controller: 'EnableBookController'
      // }).
      otherwise({
        redirectTo: '/shelf'
      });
  }]);

//TODO http://stackoverflow.com/questions/16677528/location-switching-between-html5-and-hashbang-mode-link-rewriting

}();
