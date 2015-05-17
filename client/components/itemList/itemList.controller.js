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

    displayItems.selected = [];
    displayItems.singleSelected = null;
    displayItems.allowCellEdit = true;
    displayItems.editInProgress = false;
    displayItems.multiSelect = false;



//    set up ui-grid

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

      // selection

      itemView.api.selection.on.rowSelectionChanged($scope, function(row) {
        displayItems.selected = itemView.api.selection.getSelectedRows();
        $scope.$parent.$broadcast('catalogListSelectionChanged', row);
      });

      itemView.api.selection.on.rowSelectionChangedBatch($scope, function(rows) {
        displayItems.selected = itemView.api.selection.getSelectedRows();
        $scope.$parent.$broadcast('catalogListMultipleCatalogsSelected', rows);
      });

      // cell editing

      itemView.api.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {

        if (newValue != oldValue) {
          $scope.listUtil.update('items', [rowEntity]);
        }
      });
    };

    // listen for display refreshes
    $scope.$on('redrawitems', function(event, data) {
      $scope.data.displayItems = data;
      displayItems.selected = [];
    });

    $scope.listUtil.registerKeyEvents($scope.itemView);

//
//    $scope.$on('catalogListSelectionChanged', function(event, row) {
//
//    });
//
//    // initialize ui-grid
//
//    $scope.display.itemList.onRegisterApi = function(api) {
//      $scope.display.items.api = api;
//
//      // set up columns
//
//      $scope.display.itemList.columnDefs = [
//        {
//          field: 'name', displayName: 'Name'
//        },
//        {
//          field: 'weight', displayName: 'Weight'
//        },
//        {
//          field: 'category', displayName: 'Category'
//        }
//      ];
//
//      // set up keyboard binding for this particular list
//
//      $scope.listUtil.registerKeyEvents('items', $scope);
//
//      /**
//       *  rowSelectionChanged() - logic for any selection event in the item list
//       */
//
//      api.selection.on.rowSelectionChanged($scope, function(row) {
//
//        // get current state of selected items
//        selected = api.selection.getSelectedRows();
//
//        // logic for updating data in contact details view
//        if (selected.length === 1) {
//          //just one item selected
//          $scope.data.items.singleSelected = row.entity;
//        } else {
//          //clear out data and pull in defaults when more than one row is selected
//          $scope.data.items.singleSelected = null;
//        }
//
//        if ($scope.data.items.editInProgress) {
//          $scope.selectSingleRow(row.entity);
//        }
//
//      });
//
//      /**
//       * The following three event handlers ensure that clicks registered by a row during edits
//       * don't trigger a select/deselect action for that row.
//       */
//
//      api.edit.on.beginCellEdit($scope, function(rowEntity, colDef) {
//        $scope.data.items.editInProgress = true;
//        $scope.data.items.singleSelected = rowEntity;
//        $scope.selectSingleRow(rowEntity);
//        $scope.$apply();
//      });
//
//      api.edit.on.cancelCellEdit($scope, function(rowEntity, colDef) {
//        $scope.data.items.editInProgress = false;
//        $scope.selectSingleRow(rowEntity);
//        $scope.$apply();
//      });
//
//      api.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
//
//        $scope.data.items.editInProgress = false;
//        var editedItem = rowEntity;
//
//        //the below is probaby fucked
//        if (newValue != oldValue) {
//          $scope.crud.update($scope.list, 'data.items', editedItem._id, editedItem)
//              .then(function() {
//                $scope.crud.get($scope.data.list, 'items').then(function() {
//                  // not sure why selectSingleRow doesn't work here
//                  $scope.selectSingleRow(editedItem);
//
//                });
//              });
//        }
//      });
//
//
//    };
//
//      $scope.selectSingleRow = function(rowEntity) {
//        if (!$scope.items.editInProgress) {
//          api.selection.clearSelectedRows();
//        }
//
//        // To do: why doesn't the below make the row look selected in the grid?
//        api.selection.selectRow(rowEntity);
//      };
//
//
//

  });


