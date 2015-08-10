'use strict';

angular.module('prindleApp')
  .directive('itemToolbar', function () {
    return {
      templateUrl: 'components/listToolbar/itemToolbar/itemToolbar.html',
      restrict: 'E',
      require: '^listToolbar',
      link: function (scope, element, attrs, listToolbarCtrl) {

        var _initItemToolbar = function() {
          scope.nothingSelected = true;
          scope.noCatalogSelected = true;
          scope.selectionDeletable = true;
        };

        _initItemToolbar();

        scope.$on('items-selection-changed', function() {
          scope.noItemSelected = listToolbarCtrl.nothingSelected();
          scope.noCatalogSelected = listToolbarCtrl.noCatalogSelected();
          scope.itemDeletable = listToolbarCtrl.selectionDeletable();
        });

        scope.$on('items-selection-cleared', function() {
          scope.noItemSelected = listToolbarCtrl.nothingSelected();
          scope.noCatalogSelected = listToolbarCtrl.noCatalogSelected();
          scope.itemDeletable = listToolbarCtrl.selectionDeletable();
        });

        scope.manageCategoriesAction = function() {
          listToolbarCtrl.openManageCategoriesModal();
        };

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
  });