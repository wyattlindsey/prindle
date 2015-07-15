'use strict';

angular.module('prindleApp')
  .directive('catalogToolbar', function () {
    return {
      templateUrl: 'components/listToolbar/catalogToolbar/catalogToolbar.html',
      restrict: 'E',
      require: '^listToolbar',
      controller: 'catalogToolbarCtrl',
      link: function (scope, element, attrs, listToolbarCtrl) {
        scope.initCatalogToolbar();

        scope.$on('catalogs-selection-changed', function() {
          scope.noCatalogSelected = listToolbarCtrl.nothingSelected();
          scope.catalogDeletable = listToolbarCtrl.selectionDeletable();
        });

        scope.$on('catalogs-selection-cleared', function() {
          scope.noCatalogSelected = listToolbarCtrl.nothingSelected();
          scope.catalogDeletable = listToolbarCtrl.selectionDeletable();
        });

        scope.addCatalogsAction = function() {
          listToolbarCtrl.add();
        };

        scope.copyCatalogsAction = function() {
          listToolbarCtrl.copy();
        };

        scope.deleteCatalogsAction = function() {
          listToolbarCtrl.delete();
        };
      }
    };
  })
  .controller('catalogToolbarCtrl', ['$scope', function($scope) {
    $scope.initCatalogToolbar = function() {
      $scope.nothingSelected = true;
      $scope.selectionDeletable = true;
    };
  }]);