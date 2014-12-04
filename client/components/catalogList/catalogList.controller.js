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
      $scope.catalogs.multiSelect = false;

      $scope.catalogList = {
        data: 'data.catalogs',
        enableFiltering: true,
        enableRowSelection: true,
        multiSelect: false,
        enableRowHeaderSelection: false
      };

      $scope.catalogList.onRegisterApi = function(catalogListApi) {

        $scope.catalogs.api = catalogListApi;

        // define
        $scope.catalogList.columnDefs = [
          {field: 'name', displayName: 'List'}
        ];

        // set up keyboard events for this particular list
        $scope.listUtil.registerKeyEvents('catalogs', $scope);

        catalogListApi.selection.on.rowSelectionChanged($scope, function(row) {
          $scope.$parent.$broadcast('catalogListSelectionChanged', row);
        });

      };

  });
