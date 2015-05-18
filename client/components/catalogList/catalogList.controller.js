'use strict';

/**
 * The list of lists and other collections
 */

angular.module('prindleApp')
  .controller('catalogListCtrl', function ($scope) {

    var catalogs = $scope.data.catalogs;

    // set up ui-grid instance

    $scope.catalogView = {
      data: 'data.catalogs.list',
      enableFiltering: true,
      enableRowSelection: true,
      multiSelect: false,
      enableRowHeaderSelection: false
    };

    var catalogView = $scope.catalogView;

    catalogView.selected = [];
    catalogView.editInProgress = false;

    catalogView.onRegisterApi = function(catalogViewApi) {

      catalogView.api = catalogViewApi;

      catalogView.columnDefs = [
        {field: 'name', displayName: 'Catalogs'}
      ];

      // cell editing

      catalogView.api.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {

        var editedItem = rowEntity;

        if (newValue != oldValue) {
          $scope.listUtil.update('catalogs', [rowEntity]);
        }
      });

      // set up event handlers for editing and selection
      $scope.gridService.registerSelectionEditEvents($scope, catalogView, catalogs.list, 'catalogs');

      // set up keyboard events for this particular list
      $scope.gridService.registerKeyEvents($scope.catalogView);

      // selection

      catalogView.api.selection.on.rowSelectionChanged($scope, function(row) {
        catalogView.selected = catalogView.api.selection.getSelectedRows();
        $scope.$parent.$broadcast('catalogListSelectionChanged', row);
      });

      catalogView.api.selection.on.rowSelectionChangedBatch($scope, function(rows) {
        catalogView.selected = catalogView.api.selection.getSelectedRows();
        $scope.$parent.$broadcast('catalogListMultipleCatalogsSelected', rows);
      });



    };

    $scope.selectSingleRow = function(rowEntity) {
      if (catalogView.editInProgress) {
        catalogView.api.selection.selectRow(rowEntity);
      }
    };



    // listen for display refreshes
    $scope.$on('redrawcatalogs', function(event, data) {
      catalogs.list = data;
      catalogView.selected = [];
    });

  });
