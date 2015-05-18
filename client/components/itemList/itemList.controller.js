'use strict';

/**
 * listGridCtrl handles the main list of items that are displayed in ui-grid based on the
 * list selection in the meta list
 */

angular.module('prindleApp')
  .controller('itemListCtrl', function ($scope) {

    var items = $scope.data.items;
    var displayItems = $scope.data.displayItems;


    // set up shallow reference from real data to display data
    $scope.$parent.$on('itemsLoaded', function() {
      angular.extend($scope.data.displayItems, $scope.data.items);
    });


    // set up ui-grid

    $scope.itemView = {
      data: 'data.displayItems',
      enableFiltering: true,
      enableRowSelection: true,
      multiSelect: false,
      enableRowHeaderSelection: false
    };

    var itemView = $scope.itemView;


    itemView.onRegisterApi = function(itemViewApi) {
      itemView.api = itemViewApi;

      // set up columns

      itemView.columnDefs = [
        {
          field: 'name', displayName: 'Name'
        },
        {
          field: 'weight', displayName: 'Weight'
        },
        {
          field: 'category', displayName: 'Category'
        }
      ];



      /**
       * The following event handlers ensure that clicks registered by a row during edits
       * don't trigger a select/deselect action for that row.
       */

//      itemView.api.edit.on.beginCellEdit($scope, function(rowEntity, colDef) {
//        displayItems.editInProgress = true;
//        displayItems.singleSelected = rowEntity;
//        $scope.selectSingleRow(rowEntity);
//        $scope.$apply();
//      });

//      itemView.api.edit.on.cancelCellEdit($scope, function(rowEntity, colDef) {
//        displayItems.editInProgress = false;
//        $scope.selectSingleRow(rowEntity);
//        $scope.$apply();
//      });

//      // cell editing
//
//      itemView.api.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
//        $scope.data.items.editInProgress = false;
//        if (newValue != oldValue) {
//          $scope.listUtil.update('items', [rowEntity]);
//          $scope.selectSingleRow(rowEntity);
//        }
//      });

      // set up event handlers for editing and selection
      $scope.gridService.registerSelectionEditEvents($scope, itemView, $scope.state.items, 'items');

      // set up keyboard events for this particular list
      $scope.gridService.registerKeyEvents(itemView);
    };

    $scope.selectSingleRow = function(rowEntity) {
      if (itemView.editInProgress) {
        itemView.api.selection.selectRow(rowEntity);
      }
    };

    // listen for display refreshes
    $scope.$on('redrawitems', function(event, data) {
      $scope.data.displayItems = data;
      itemView.selected = [];
    });

  });


