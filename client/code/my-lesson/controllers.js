module.exports = function(discussModule) {

  function ChatCtrl($scope) {
    $scope.messages = [];

    // Listen out for newMessage events coming from the server
    ss.event.on('newMessage', function(message) {
      $scope.$apply($scope.messages.push({text: message, time: new Date() }));
    });
  /*
      time: function() { return timestamp(); }
    });

    // Append it to the #chatlog div and show effect
    return $(html).hide().appendTo('#chatlog').slideDown();
  */

    $scope.postMessage = function() {
      ss.rpc('demo.sendMessage', $scope.myMessage, function(a) {
        if (a) {
          // console.log('message posted!');
        } else {
          // console.log('Oops! Unable to send message');
        }
      });
    };
  }

  discussModule.controller('ChatCtrl',['$scope',ChatCtrl]);


  //TODO consider
  discussModule.controller('AppCtrl', ['$scope', '$route', '$routeParams', function ($scope, $route, $routeParams) {

    var render = function () {
      // action is something like 'home.view'
      var action = $route.current.action,
      // path becomes ['home', 'view']
        path = (action && action.split('.')) || [];

      // you can use path array to build more complex
      // views within views by having a hierarchy defined

      $scope.action = action;
      $scope.path = path;

      $scope.isHome = (path[0] === 'home');
      $scope.isFoo = (path[0] === 'foo');
      $scope.isBar = (path[0] === 'bar');
    };

    // updates whenever route changes
    $scope.$on('$routeChangeSuccess', function (scopr, next, current) {
      render();
    });
  }]);

  discussModule.controller('NavCtrl', ['$scope', '$location', function ($scope, $location) {

    $scope.isActive = function (clicked) {
      if (!clicked) { return ''; }
      var path = $location.path(),
        location = (path) ? path.substring(1) : '';

      return location === clicked ? 'active' : '';
    };
  }]);

  discussModule.controller('HomeCtrl', ['$scope', 'pubsub', function ($scope, pubsub) {
    
    $scope.date = 'never';

    $scope.$on('foo:bar', function (evt, msg) {
      $scope.date = msg.toString();
    });
  }]);

};
