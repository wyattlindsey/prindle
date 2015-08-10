'use strict';

angular.module('prindleApp')
  .directive('categoryToolbar', function () {
    return {
      templateUrl: 'components/listToolbar/categoryToolbar/categoryToolbar.html',
      restrict: 'E',
      require: '^listToolbar',
      link: function (scope, element, attrs, listToolbarCtrl) {

        var _initCategoryToolbar = function() {
          scope.noCategorySelected = true;
          scope.selectionDeletable = true;
        };

        _initCategoryToolbar();

        scope.$on('categories-selection-changed', function() {
          scope.noCategorySelected = listToolbarCtrl.nothingSelected();
          scope.categoryDeletable = listToolbarCtrl.selectionDeletable();
        });

        scope.addCategoryAction = function() {
          listToolbarCtrl.add();
        };

        scope.copyCategoryAction = function() {
          listToolbarCtrl.copy();
        };

        scope.deleteCategoryAction = function() {
          listToolbarCtrl.delete();
        };
      }
    };
  });