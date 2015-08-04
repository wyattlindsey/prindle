'use strict';

angular.module('prindleApp')
  .controller('categoryModalCtrl', ['$scope', 'appData', 'guiState', 'listUtil', 'categoryService', 'gridService',
    function ($scope, appData, guiState, listUtil, categoryService, gridService) {

      $scope.categories = appData.data.categories;
      $scope.displayCategories = [];
      $scope.displayItemsInCategory = [];

      $scope.removeCategory = function(category) {
        categoryService.delete(category)
          .then(function () {
            $scope.categories = appData.data.categories;
          });
      };

      var _getDisplayCategories = function() {
        var displayCategories = [];

        displayCategories.push({name: 'All items', readOnly: true});
        displayCategories.push({name: 'Uncategorized', readOnly: true});

        Array.prototype.push.apply(displayCategories, appData.data.categories);

        return displayCategories;
      };


      $scope.$on('updated-categories', function(event, data) {
        _.forEach(appData.data.items, function(item) {
          if (item.category === data.oldValue) {
            item.category = data.newValue;
            listUtil.update('items', item);
          }
        });
      });


      /**
       * Category grid
       */

      // need to add an uncategorized ... category :)

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

        $scope.displayCategories = _getDisplayCategories();

        $scope.categoryView.api = categoryViewApi;

        // set up event handlers for editing and selection
        gridService.registerSelectionEditEvents($scope, $scope.categoryView, 'categories');

        // set up keyboard events for this particular list
        gridService.registerKeyEvents($scope.categoryView);

      };


      $scope.$on('refresh-categories', function() {
        console.log('refreshing');
        $scope.displayCategories = _getDisplayCategories();
      });


      $scope.$on('item-dropped', function(event, data) {
        var sourceItems = [];

        if (guiState.state.items.selected.length > 0) {
          sourceItems = guiState.state.items.selected;
        }

        sourceItems.push(angular.element(data.src).scope().$parent.row.entity);
        var destEntity = angular.element(data.dest).scope().$parent.row.entity;


        _addItemsToCategory(sourceItems, destEntity.name);

      });


      var _addItemsToCategory = function(sourceItems, destCategory) {

        if (destCategory === 'Uncategorized') {
          _.forEach(sourceItems, function(item) {
            item.category = '';
          });
        } else if (destCategory === 'All items') {
          // do nothing
        } else {
          _.forEach(sourceItems, function(item) {
            item.category = destCategory;
            listUtil.update('items', item)
              .then(function() {
              }, function(err) {
                throw new Error(err);
              });
          });
        }

        _refreshItemsInCategory();

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



      $scope.$on('categories-selection-changed', function(event, rows) {
        if (guiState.state.categories.selected.length === 1) {
          $scope.displayItemsInCategory = _getItemsForCategory(guiState.state.categories.selected[0].name);
        } else {
          $scope.displayItemsInCategory = [];
        }
      });


      var _refreshItemsInCategory = function() {
        var selectedCategoryName = guiState.state.categories.selected[0].name;
        $scope.displayItemsInCategory = _getItemsForCategory(selectedCategoryName);
      };


      var _getItemsForCategory = function(categoryName) {
        var items = [];

        if (categoryName === 'All items') {
          items = appData.data.items;
        } else if (categoryName === 'Uncategorized') {
          _.forEach(appData.data.items, function(item) {
            if (typeof item.category == 'undefined' || item.category === '') {
              items.push(item);
            }
          });
        } else {
          _.forEach(appData.data.items, function(item) {
            console.log(item.category);   // something going wrong here
            if (item.category === categoryName) {
              items.push(item);
            }
          });
        }

        return items;
      };

    }]);
