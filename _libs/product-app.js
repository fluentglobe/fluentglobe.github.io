require('./impl.js'); 
require('./form.js');

if (window.angular) {

    var productApp = angular.module('productApp', [ /*'toggle-switch'*/ ]);
    productApp.config(['$interpolateProvider', function($interpolateProvider) {
          return $interpolateProvider.startSymbol('{(').endSymbol(')}');
        }
    ]);

    productApp.controller("add-review",['$scope', function($scope) {
        $scope.device = 'off';//'iPad';
    }]);

}
