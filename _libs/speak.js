require('../bower_components/angular-route/angular-route.js');
var books = require('../bower_components/fluent-books/controllers.js');

var speakApp = angular.module('speakApp', ['ngRoute','speakControllers','toggle-switch']);
speakApp.config(['$interpolateProvider', function($interpolateProvider) {
      return $interpolateProvider.startSymbol('{(').endSymbol(')}');
    }
]);

!function() {
  var HTMLElement = Resolver("essential::HTMLElement::");

function SpeakController($scope) {
  $scope.books = [
    { 'name':'Recipes for Visiting Brazil'},
    { 'name':'Introduction to Portuguese' },
    { 'name':'Speak English in London'},
    { 'name':'Introduction to English' }
  ];
}

function ReviewBookController($scope,$routeParams) {
  var ngView = document.querySelector("[ng-view]");
  // debugger;
  HTMLElement.query(ngView).withBranch().queue();
} 

speakApp
  .controller('SpeakController',SpeakController)
  .controller('ReviewBookController',['$scope','$routeParams',ReviewBookController]);

speakApp.config(['$routeProvider','$locationProvider',
  function($routeProvider,$locationProvider) {
    $routeProvider.
      when('/shelf', {
        // template: "-- shelf --",
        templateUrl: '/partials/shelf.html',
        controller: 'ShelfController'
      }).
      when('/pick/:name', {
        templateUrl: '/partials/pick-book.html',
        controller: 'PickBookController'
      }).
      when('/review/recipes-brazil', {
        templateUrl: '/partials/review-recipes-brazil.html',
        controller: 'ReviewBookController'
      }).
      // when('/review/:key/:name', {
      //   templateUrl: '/partials/enable-book.html',
      //   controller: 'EnableBookController'
      // }).
      when('/enable/:key/:name', {
        templateUrl: '/partials/enable-book.html',
        controller: 'EnableBookController'
      }).
      otherwise({
        // redirectTo: '/review/recipes-brazil' //'/shelf'
        redirectTo: '/shelf'
      });
  }]);

//TODO http://stackoverflow.com/questions/16677528/location-switching-between-html5-and-hashbang-mode-link-rewriting

}();
