'use strict';

/**
 * listGridCtrl handles the main list of items that are displayed in ui-grid based on the
 * list selection in the meta list
 */

angular.module('prindleApp')
  .controller('listGridCtrl', function ($scope) {

    $scope.selectedItems = [];
    $scope.singleSelectedItem = null;
    $scope.allowCellEdit = true;
    $scope.editInProgress = false;

    // set up ui-grid

    $scope.listGrid = {
      data: 'data.items',
      enableFiltering: true,
      enableRowSelection: true,
      multiSelect: false,
      enableRowHeaderSelection: false
    };

    $scope.$on('listCatalogSelectionChanged', function(event, row) {

    });

    // initialize ui-grid

    $scope.listGrid.onRegisterApi = function(listGridApi) {
      $scope.listGridApi = listGridApi;

      // set up columns

      $scope.listGrid.columnDefs = [
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

      listGridApi.selection.on.rowSelectionChanged($scope, function(row) {

        // get current state of selected items
        $scope.selectedItems = listGridApi.selection.getSelectedRows();

        // logic for updating data in contact details view
        if ($scope.selectedItems.length === 1) {
          //just one item selected
          $scope.singleSelectedItem = row.entity;
        } else {
          //clear out data and pull in defaults when more than one row is selected
          $scope.singleSelectedItem = null;
        }

        if ($scope.editInProgress) {
          $scope.selectSingleRow(row.entity);
        }

      });

      /**
       * The following three event handlers ensure that clicks registered by a row during edits
       * don't trigger a select/deselect action for that row.
       */

      listGridApi.edit.on.beginCellEdit($scope, function(rowEntity, colDef) {
        console.log(colDef);
        $scope.editInProgress = true;
        $scope.singleSelectedItem = rowEntity;
        $scope.selectSingleRow(rowEntity);
        $scope.$apply();
      });

      listGridApi.edit.on.cancelCellEdit($scope, function(rowEntity, colDef) {
        $scope.editInProgress = false;
        $scope.selectSingleRow(rowEntity);
        $scope.$apply();
      });

      listGridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {

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
          $scope.listGridApi.selection.clearSelectedRows();
        }

        // To do: why doesn't the below make the row look selected in the grid?
        $scope.listGridApi.selection.selectRow(rowEntity);
      };


      /**
       * The below is jQuery spaghetti code to deal with the shift and delete keys.
       * To do: use ui-grid as much as possible for this and move out into a controller-
       * independent service.
       */

      // keydown/keyup to enable/disable multi-select
      $('body').keydown(function (e) {
        if ((e.keyCode === 16 || e.keyCode === 17 || e.metaKey || e.keyCode === 224 || e.keyCode === 91 || e.keyCode === 93) && !$scope.multiSelect) {
          $scope.listGridApi.selection.setMultiSelect(true);
          $scope.listGrid.multiSelect = true;
          $scope.allowCellEdit = false;
        }
      }).keyup(function (e) {
        if (e.keyCode === 16 || e.keyCode === 17 || e.metaKey || e.keyCode === 224 || e.keyCode === 91 || e.keyCode === 93) {
          $scope.listGridApi.selection.setMultiSelect(false);
          $scope.listGrid.multiSelect = false;
          $scope.allowCellEdit = true;
        }
      });

      //handle case of meta-tab to other application
      //where keyup never happens and multi-select stays true
      $(window).blur(function() {
        $scope.listGridApi.selection.setMultiSelect(false);
        $scope.listGrid.multiSelect = false;
        $scope.allowCellEdit = true;
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


