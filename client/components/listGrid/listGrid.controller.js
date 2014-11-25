'use strict';

/**
 * listGridCtrl handles the main list of items that are displayed in ui-grid based on the
 * list selection in the meta list
 */

angular.module('prindleApp')
  .controller('listGridCtrl', function ($scope) {

    // set up ui-grid

    $scope.listGrid = {
      data: 'itemsForSelectedCollection',
      enableFiltering: true,
      enableRowSelection: true,
      multiSelect: false,
      enableRowHeaderSelection: false
    };

    $scope.$on('listCatalogSelectionChanged', function(event, row) {

      $scope.getItemsForCollection(row.entity._id);
    });

    $(function() {
      $('.ui-grid-row').addClass('.ui-widget-content').addClass('.drag');
      $('.drag').draggable();
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
