'use strict';

/**
 * listGridCtrl handles the main list of items that are displayed in ui-grid based on the
 * list selection in the meta list
 */

angular.module('prindleApp')
  .controller('itemListCtrl', function ($scope) {

    $scope.items.selected = [];
    $scope.items.singleSelected = null;
    $scope.items.allowCellEdit = true;
    $scope.items.editInProgress = false;

    // set up ui-grid

    $scope.itemList = {
      data: 'data.items',
      enableFiltering: true,
      enableRowSelection: true,
      multiSelect: false,
      enableRowHeaderSelection: false
    };

    $scope.$on('catalogListSelectionChanged', function(event, row) {

    });

    // initialize ui-grid

    $scope.itemList.onRegisterApi = function(api) {
      $scope.items.api = api;

      // set up columns

      $scope.itemList.columnDefs = [
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
       *  rowSelectionChanged() - logic for any selection event in the item list
       */

      api.selection.on.rowSelectionChanged($scope, function(row) {

        // get current state of selected items
        $scope.items.selected = api.selection.getSelectedRows();

        // logic for updating data in contact details view
        if ($scope.items.selected.length === 1) {
          //just one item selected
          $scope.items.singleSelected = row.entity;
        } else {
          //clear out data and pull in defaults when more than one row is selected
          $scope.items.singleSelected = null;
        }

        if ($scope.editInProgress) {
          $scope.selectSingleRow(row.entity);
        }

      });

      /**
       * The following three event handlers ensure that clicks registered by a row during edits
       * don't trigger a select/deselect action for that row.
       */

      api.edit.on.beginCellEdit($scope, function(rowEntity, colDef) {
        $scope.items.editInProgress = true;
        $scope.items.singleSelected = rowEntity;
        $scope.selectSingleRow(rowEntity);
        $scope.$apply();
      });

      api.edit.on.cancelCellEdit($scope, function(rowEntity, colDef) {
        $scope.items.editInProgress = false;
        $scope.selectSingleRow(rowEntity);
        $scope.$apply();
      });

      api.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {

        $scope.editInProgress = false;
        var editedItem = rowEntity;

        if (newValue != oldValue) {
          $scope.crud.update($scope.data, 'items', editedItem._id, editedItem)
              .then(function() {
                $scope.crud.get($scope.data, 'items').then(function() {
                  // not sure why selectSingleRow doesn't work here
                  $scope.selectSingleRow(editedItem);

                });
              });
        }
      });


    };

      $scope.selectSingleRow = function(rowEntity) {
        if (!$scope.editInProgress) {
          $scope.items.api.selection.clearSelectedRows();
        }

        // To do: why doesn't the below make the row look selected in the grid?
        $scope.items.api.selection.selectRow(rowEntity);
      };


      /**
       * The below is jQuery to deal with the shift and delete keys.
       * To do: use ui-grid as much as possible for this and move out into a controller-
       * independent service.
       */

      // keydown/keyup to enable/disable multi-select
      $('body').keydown(function (e) {
        if ((e.keyCode === 16 || e.keyCode === 17 || e.metaKey || e.keyCode === 224 || e.keyCode === 91 || e.keyCode === 93) && !$scope.multiSelect) {
          $scope.items.api.selection.setMultiSelect(true);
          $scope.itemList.multiSelect = true;
          $scope.items.allowCellEdit = false;
        }
      }).keyup(function (e) {
        if (e.keyCode === 16 || e.keyCode === 17 || e.metaKey || e.keyCode === 224 || e.keyCode === 91 || e.keyCode === 93) {
          $scope.items.api.selection.setMultiSelect(false);
          $scope.itemList.multiSelect = false;
          $scope.items.allowCellEdit = true;
        }
      });

      //handle case of meta-tab to other application
      //where keyup never happens and multi-select stays true
      $(window).blur(function() {
        $scope.items.api.selection.setMultiSelect(false);
        $scope.itemList.multiSelect = false;
        $scope.items.allowCellEdit = true;
      });

      //delete key brings up the delete confirm modal
      $('body').keydown(function (e) {
        if (e.keyCode === 8 || e.keyCode === 46) {
          if (event.target.nodeName !== 'INPUT') {
            e.preventDefault();
//            $scope.deleteAction();
            $scope.$apply();  // seems to be necessary to update the view with any alerts
          }
        }
      });

  });


