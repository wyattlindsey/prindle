'use strict';

/**
 * listGridCtrl handles the main list of items that are displayed in ui-grid based on the
 * list selection in the meta list
 */

angular.module('prindleApp')
  .controller('listGridCtrl', function ($scope) {

    // set up ui-grid

    $scope.listGrid = {
      data: 'items',
      enableFiltering: true,
      enableRowSelection: true,
      multiSelect: false,
      enableRowHeaderSelection: false
    };

    $scope.$on('listCatalogSelectionChanged', function(event, row) {
      $scope.items = [];
      $scope.items = row.entity.items;
      console.log(row.entity.items[0]);
    });

    // initialize ui-grid

    $scope.listGrid.onRegisterApi = function(gridApi) {
      $scope.listGridApi = gridApi;

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
    };

  });