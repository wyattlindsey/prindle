'use strict';

/**
 * The list of lists and other collections
 */

angular.module('prindleApp')
  .controller('catalogListCtrl', function ($scope) {

      $scope.catalogs.selected = [];
      $scope.catalogs.singleSelected = null;
      $scope.catalogs.allowCellEdit = true;
      $scope.catalogs.editInProgress = false;

      $scope.catalogList = {
        data: 'data.collections',
        enableFiltering: true,
        enableRowSelection: true,
        multiSelect: false,
        enableRowHeaderSelection: false
      };

      $scope.catalogList.onRegisterApi = function(catalogListApi) {

        $scope.catalogs.api = catalogListApi;

        $scope.catalogList.columnDefs = [
          {field: 'name', displayName: 'List'}
        ];

        catalogListApi.selection.on.rowSelectionChanged($scope, function(row) {
          $scope.$parent.$broadcast('catalogListSelectionChanged', row);
        });

      };

  });
