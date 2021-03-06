'use strict';

angular.module('prindleApp')
  .controller('categoryModalCtrl', ['$scope', 'appData', 'guiState', 'listUtil', 'categoryService', 'gridService',
    function ($scope, appData, guiState, listUtil, categoryService, gridService) {

      $scope.displayCategories = [];
      $scope.displayItemsInCategory = [];

      $scope.removeCategory = function(category) {
        categoryService.delete(category)
          .then(function () {
            $scope.displayCategories = _getDisplayCategories();
          });
      };

      var _getDisplayCategories = function() {    // there should probably be a _refreshCategories
                                                  // function that calls this instead of being called
                                                  // a bunch of times everywhere
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

      var toolCellTemplate = '<div class="toolCell" ng-hide={{row.entity.readOnly}}>' +
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
              field: 'name',
              displayName: 'Categories',
              cellTemplate: '<div x-lvl-drop-target="{{row.entity.name !== \'All items\'}}" ' +
                'x-on-drop="droppedOnCategory(dragEl, dropEl)"' +
                'class="ui-grid-cell-contents">{{row.entity.name}}</div>'
            }
          ],
          enableRowHeaderSelection: false
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
        $scope.displayCategories = _getDisplayCategories();
      });


      $scope.$on('added-to-categories', function() {
        $scope.displayCategories = _getDisplayCategories();
      });


      $scope.$on('deleted-from-categories', function() {
        guiState.state.categories.selected = [];
        $scope.$parent.$broadcast('categories-selection-cleared');
        $scope.displayCategories = _getDisplayCategories();
      });



      $scope.$on('item-dropped', function(event, data) {
        var sourceItems = [];

        if (guiState.state.itemsInCategory.selected.length > 0) {
          sourceItems = guiState.state.itemsInCategory.selected;
        } else {  // when nothing is selected but you drag by the handle
          sourceItems.push(angular.element(data.src).scope().$parent.row.entity);
        }

        var destEntity = angular.element(data.dest).scope().$parent.row.entity;

        _addItemsToCategory(sourceItems, destEntity.name);

      });


      var _addItemsToCategory = function(sourceItems, destCategory) {

        var updated = [];

        if (destCategory === 'Uncategorized') {
          _.forEach(sourceItems, function(item) {
            item.category = '';
            updated.push(item);
          });
        } else if (destCategory === 'All items') {
          // do nothing
        } else {
          _.forEach(sourceItems, function(item) {
            item.category = destCategory;
            updated.push(item);
          });
        }

        listUtil.update('items', updated)
          .then(function() {
          }, function(err) {
            throw new Error(err);
          });

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
        gridService.registerSelectionEditEvents($scope, $scope.itemsInCategoryView, 'itemsInCategory', false);

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
            if (item.category === categoryName) {
              items.push(item);
            }
          });
        }

        return items;
      };

    }]);

// something seriously wrong with selection maybe - drop one item from uncat. to another and watch
// them all disappear, only happens sometimes rrrr.  Maybe list of selections isn't being updated
// where it should