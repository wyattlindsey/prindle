'use strict';

angular.module('prindleApp')
  .directive('listToolbar', function () {
    return {
      templateUrl: 'components/listToolbar/listToolbar.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
        scope.$on((attrs.listName + '-selection-changed'), function() {
          scope.nothingSelected = (scope.state.catalogs.selected.length === 0);
        });

      },
      controller: 'listToolbarCtrl'
    };
  })
  .controller('listToolbarCtrl', ['$scope', function($scope) {

    $scope.nothingSelected = $scope.state.catalogs.selected.length === 0;
//    $scope.

    $scope.addAction = function() {
      console.log('adding');

      $scope.listUtil.add('catalogs',
        [{
          name: 'untitled',
          readOnly: false
        }
        ]
      );

    };
  }]);