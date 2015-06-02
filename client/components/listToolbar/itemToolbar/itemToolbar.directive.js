'use strict';

angular.module('prindleApp')
  .directive('itemToolbar', function () {
    return {
      templateUrl: 'components/listToolbar/itemToolbar/itemToolbar.html',
      restrict: 'E',
      require: '^listToolbar',
      controller: 'itemToolbarCtrl',
      link: function (scope, element, attrs, listToolbarCtrl) {
        scope.initItemToolbar();

        scope.$on('items-selection-changed', function() {
          scope.nothingSelected = listToolbarCtrl.nothingSelected();
          scope.selectionDeletable = listToolbarCtrl.selectionDeletable();
        });

        scope.addItemsAction = function() {
          listToolbarCtrl.add();
        };

        scope.copyItemsAction = function() {
          listToolbarCtrl.copy();
        };

        scope.deleteItemsAction = function() {
          listToolbarCtrl.delete();
        };
      }
    };
  })
  .controller('itemToolbarCtrl', ['$scope', function($scope) {
    $scope.initItemToolbar = function() {
      $scope.nothingSelected = true;
      $scope.selectionDeletable = true;
    };
  }]);