'use strict';

/**
 * The list of lists and other collections
 */

angular.module('prindleApp')
  .controller('listCatalogCtrl', function ($scope) {

      $scope.listCatalog = {
        data: 'collections',
        enableFiltering: true,
        enableRowSelection: true,
        multiSelect: false,
        enableRowHeaderSelection: false
      };

      $scope.listCatalog.onRegisterApi = function(gridApi) {

        $scope.listCatalogApi = gridApi;

        $scope.listCatalog.columnDefs = [
          {field: 'name', displayName: 'List'}
        ];
      };
  });
