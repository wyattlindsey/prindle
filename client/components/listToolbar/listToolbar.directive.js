'use strict';

angular.module('prindleApp')
  .directive('listToolbar', ['guiState', function (guiState) {
    return {
      restrict: 'E',
      scope: {
        listName: '='
      },
      transclude: true,
      link: function (scope, element, attrs, ctrl, transclude) {
        transclude(scope.$new(), function(clone) {
          element.append(clone);
        });

        scope.$on((scope.listName + '-selection-changed'), function() {
          if (guiState.state[scope.listName].selected.length === 0) {
            scope.nothingSelected = true;
          } else if (guiState.state[scope.listName].selected.length === 1) {
            scope.selectionDeletable = !guiState.state[scope.listName].selected[0].readOnly;
            scope.nothingSelected = false;
          } else {
            scope.nothingSelected = false;
          }
        });

        scope.listName = attrs.listName;


      },
      controller: 'listToolbarCtrl'
    };
  }])
  .controller('listToolbarCtrl', ['$scope', 'Modal', 'listUtil', 'guiState', 'appData',
      function($scope, Modal, listUtil, guiState, appData) {

    $scope.add = function() {
      listUtil.add($scope.listName,
        [{
          name: 'untitled',
          readOnly: false
        }
        ]
      );
    };


    $scope.copy = function() {
      if (typeof appData.data[$scope.listName]  === 'undefined' || appData.data[$scope.listName].length === 0 ||
        guiState.state[$scope.listName].selected.length === 0) {
        return;
      } else {
        listUtil.copy($scope.listName, guiState.state[$scope.listName].selected);
      }
    };


    $scope.delete = Modal.confirm.delete(function() {
      if (typeof appData.data[$scope.listName] === 'undefined' || appData.data[$scope.listName].length === 0 ||
        guiState.state[$scope.listName].selected.length === 0) {
        return;
      } else {
        listUtil.delete($scope.listName, guiState.state[$scope.listName].selected);
      }
    });
  }]);