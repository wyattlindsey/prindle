'use strict';

angular.module('prindleApp')
  .directive('listToolbar', function () {
    return {
      templateUrl: 'components/listToolbar/listToolbar.html',
      restrict: 'E',
//      scope: {
//        listName: '='
//      },
      link: function (scope, elem, attr) {
        scope.listName = attr.listName;
        scope.$on((scope.listName + '-selection-changed'), function() {
          if (scope.state[scope.listName].selected.length === 0) {
            scope.nothingSelected = true;
          } else if (scope.state[scope.listName].selected.length === 1) {
            scope.WLselectionDeletable = !scope.state[scope.listName].selected[0].readOnly;
            scope.nothingSelected = false;
          } else {
            scope.nothingSelected = false;
          }
        });
      },
      controller: 'listToolbarCtrl'
    };
  })
  .controller('listToolbarCtrl', ['$scope', 'Modal', function($scope, Modal) {

    $scope.nothingSelected = false;
    $scope.WLselectionDeletable = true;

    $scope.addAction = function() {
      $scope.listUtil.add($scope.listName,
        [{
          name: 'untitled',
          readOnly: false
        }
        ]
      );
    };


    $scope.copyAction = function() {
      console.log($scope.data[$scope.listName]);
      if (typeof $scope.data[$scope.listName]  === 'undefined' || $scope.data[$scope.listName].length === 0 ||
        $scope.state[$scope.listName].selected.length === 0) {
        return;
      } else {
        $scope.listUtil.copy($scope.listName, $scope.state[$scope.listName].selected);
      }
    };


    $scope.deleteAction = Modal.confirm.delete(function() {
      if (typeof $scope.data[$scope.listName] === 'undefined' || $scope.data[$scope.listName].length === 0 ||
        $scope.state[$scope.listName].selected.length === 0) {
        return;
      } else {
        $scope.listUtil.delete('catalogs', $scope.state[$scope.listName].selected);
      }
    });
  }]);