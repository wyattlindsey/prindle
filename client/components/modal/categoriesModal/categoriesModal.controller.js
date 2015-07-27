'use strict';

angular.module('prindleApp')
  .controller('categoriesModalCtrl', ['$scope', 'appData', 'guiState', 'listUtil', 'categoryService', 'gridService',
    function ($scope, appData, guiState, listUtil, categoryService, gridService) {
      $scope.categories = appData.data.categories;
      $scope.displayCategories = appData.data.categories;
      $scope.displayItemsInCategory = [];

      $scope.removeCategory = function (category) {
        categoryService.delete(category)
          .then(function () {
            $scope.categories = appData.data.categories;
          });
      };

//      var oldName;
//
//      $scope.preUpdate = function (category) {
//        oldName = category.name;
//      };
//
//      $scope.update = function (category) {
//        if (category.name !== oldName) {
//          categoryService.update(category, oldName);
//        }
//      };

      /**
       * Category grid
       */

      var toolCellTemplate = '<div class="toolCell">' +
        '<a href="#" ng-click="grid.appScope.removeCategory(row.entity)" ' +
        '<i class="fa fa-remove item-list-delete-tool">' +
        '</i></div>';


        $scope.categoryView = {
          data: 'displayCategories',
          enableFiltering: true,
          enableRowSelection: true,
          multiSelect: false,
          columnDefs: [
            {
              field: 'null',
              displayName: '',
              cellTemplate: toolCellTemplate,
              enableSorting: false,
              enableColumnMenu: false,
              enableFiltering: false,
              enableCellEdit: false,
              width: 50
            },
            {
              field: 'name', displayName: 'Categories'
            }
          ],
          enableRowHeaderSelection: false,
          rowTemplate: '<div x-lvl-drop-target="true" x-on-drop="droppedOnCategory(dragEl, dropEl)" ng-click="grid.appScope.fnOne(row)" ' +
            'ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>'
        };

      $scope.categoryView.onRegisterApi = function (categoryViewApi) {

        $scope.categoryView.api = categoryViewApi;

        // set up event handlers for editing and selection
        gridService.registerSelectionEditEvents($scope, $scope.categoryView, 'categories');

        // set up keyboard events for this particular list
        gridService.registerKeyEvents($scope.categoryView);

      };


      $scope.$on('refresh-categories', function() {
        $scope.displayCategories = appData.data.categories;
      });


      $scope.$on('item-dropped', function(event, data) {
        var sourceItems = [];

        if (guiState.state.items.selected.length > 0) {
          sourceItems = guiState.state.items.selected;
        }

        sourceItems.push(angular.element(data.src).scope().$parent.row.entity);
        var destEntity = angular.element(data.dest).scope().$parent.row.entity;

        _addItemsToCategory(sourceItems, destEntity);
      });


      var _addItemsToCategory = function(sourceItems, destCategory) {

        _.forEach(sourceItems, function(item) {
          item.category = destCategory.name;
          listUtil.update('items', item)
            .then(function() {
              $scope.$parent.$broadcast('refresh-itemsInCategory');
            });
        });

        $scope.$parent.$broadcast('refresh-itemsInCategory');

      };



      /**
       * itemsInCategory grid
       */

      var dragCellTemplate = '<div x-lvl-draggable="true"><i class="fa fa-arrows item-list-drag-arrow"></i></div>';

      $scope.itemsInCategoryView = {
        data: 'displayItemsInCategory',
        enableFiltering: true,
        enableRowSelection: true,
        multiSelect: false,
        columnDefs: [
          {
            field: 'null',
            displayName: '',
            cellTemplate: dragCellTemplate,
            enableSorting: false,
            enableColumnMenu: false,
            enableFiltering: false,
            enableCellEdit: false,
            width: 50
          },
          {
            field: 'name', displayName: 'Items'
          }
        ],
        enableRowHeaderSelection: false
      };


      $scope.itemsInCategoryView.onRegisterApi = function (itemsInCategoryView) {

        $scope.itemsInCategoryView.api = itemsInCategoryView;

        // set up event handlers for editing and selection
        gridService.registerSelectionEditEvents($scope, $scope.itemsInCategoryView, 'items');

        // set up keyboard events for this particular list
        gridService.registerKeyEvents($scope.itemsInCategoryView);

      };


      $scope.$on('refresh-itemsInCategory', function() {
        var selectedCategoryName = guiState.state.categories.selected[0].name;
        $scope.displayItemsInCategory = $scope.getItemsForCategory(selectedCategoryName);
      });


      $scope.$on('categories-selection-changed', function(event, rows) {
        if (guiState.state.categories.selected.length === 1) {
          $scope.displayItemsInCategory = $scope.getItemsForCategory(guiState.state.categories.selected[0].name);
        } else {
          $scope.displayItemsInCategory = [];
        }
      });


      $scope.getItemsForCategory = function(categoryName) {
        var items = [];
        _.forEach(appData.data.items, function(item) {
          if (item.category === categoryName) {
            items.push(item);
          }
        });
        return items;
      };

    }]);
