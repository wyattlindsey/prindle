'use strict';

/**
 * The list of lists and other collections
 */

angular.module('prindleApp')
  .controller('catalogListCtrl', function ($scope) {


    $scope.data.catalogs.selected = [];
    $scope.data.catalogs.singleSelected = null;
    $scope.data.catalogs.allowCellEdit = true;
    $scope.data.catalogs.editInProgress = false;
    $scope.data.catalogs.multiSelect = false;


    // set up ui-grid instance

    $scope.catalogList = {
      data: 'data.catalogs.list',
      enableFiltering: true,
      enableRowSelection: true,
      multiSelect: false,
      enableRowHeaderSelection: false
    };


    $scope.catalogList.onRegisterApi = function(catalogListApi) {

      $scope.catalogList.api = catalogListApi;

      $scope.catalogList.columnDefs = [
        {field: 'name', displayName: 'List'}
      ];

      // set up keyboard events for this particular list
      $scope.listUtil.registerKeyEvents($scope.catalogList);

      catalogListApi.selection.on.rowSelectionChanged($scope, function(row) {
        $scope.data.catalogs.selected = catalogListApi.selection.getSelectedRows();
        $scope.$parent.$broadcast('catalogListSelectionChanged', row);
      });

      catalogListApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {
        $scope.data.catalogs.selected = catalogListApi.selection.getSelectedRows();
        $scope.$parent.$broadcast('catalogListMultipleCatalogsSelected', rows);
      });

    };

  });
