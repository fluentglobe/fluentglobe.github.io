
angular.module('discuss.filters', []).

  filter('foobar', function () {
    return function (thing) {
      return thing + " blah ";
    };
  }).

  filter('barfoo', function () {
    return function (otherThing) {
      return otherThing + " foo ";
    };
  });
