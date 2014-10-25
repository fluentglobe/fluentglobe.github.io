    // var lesson = require('lesson');
    // var book = require('book');
    // var router = require('router');

angular.module('discuss.directives', [])
  .directive('fooBar', function () {
    return {
      restrict: 'A',
      require: 'discussModel',
      link: function ($scope, element, attr, ctrl) {

      }
    };
  }).directive('barFoo', function () {
    return {
      restrict: 'A',
      require: 'discussModel',
      link: function ($scope, element, attr, ctrl) {

      }
    };
  });