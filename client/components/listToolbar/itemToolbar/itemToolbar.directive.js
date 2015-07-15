'use strict';

angular.module('prindleApp')
  .directive('itemToolbar', function () {
    return {
      templateUrl: 'components/listToolbar/itemToolbar/itemToolbar.html',
      restrict: 'E',
      require: '^listToolbar',
      controller: 'itemToolbarCtrl',
      link: function (scope, element, attrs, listToolbar) {
        scope.initItemToolbar();

        scope.$on('items-selection-changed', function() {
          scope.noItemSelected = listToolbar.nothingSelected();
          scope.noCatalogSelected = listToolbar.noCatalogSelected();
          scope.itemDeletable = listToolbar.selectionDeletable();
        });

        scope.$on('items-selection-cleared', function() {
          scope.noItemSelected = listToolbar.nothingSelected();
          scope.noCatalogSelected = listToolbar.noCatalogSelected();
          scope.itemDeletable = listToolbar.selectionDeletable();
        });

        scope.addItemsAction = function() {
          listToolbar.add();
        };

        scope.copyItemsAction = function() {
          listToolbar.copy();
        };

        scope.deleteItemsAction = function() {
          listToolbar.delete();
        };
      }
    };
  })
  .controller('itemToolbarCtrl', ['$scope', function($scope) {
    $scope.initItemToolbar = function() {
      $scope.nothingSelected = true;
      $scope.noCatalogSelected = true;
      $scope.selectionDeletable = true;
    };
  }]);