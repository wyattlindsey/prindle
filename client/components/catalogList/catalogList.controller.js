'use strict';

/**
 * The list of lists and other collections
 */

angular.module('prindleApp')
  .controller('catalogListCtrl', function ($scope) {

    var catalogs = $scope.data.catalogs;
    var state = $scope.state.catalogs;


    // set up ui-grid instance

    $scope.catalogView = {
      data: 'data.catalogs',
      enableFiltering: true,
      enableRowSelection: true,
      multiSelect: false,
      enableRowHeaderSelection: false
    };

    var catalogView = $scope.catalogView;

    catalogView.onRegisterApi = function(catalogViewApi) {

      catalogView.api = catalogViewApi;

      catalogView.columnDefs = [
        {field: 'name', displayName: 'Catalogs'}
      ];

      // set up event handlers for editing and selection
      $scope.gridService.registerSelectionEditEvents($scope, catalogView, $scope.state.catalogs, 'catalogs');

      // set up keyboard events for this particular list
      $scope.gridService.registerKeyEvents($scope.catalogView);

    };


    // initialize master list

    $scope.$on('startupItemsLoaded', function(data) {
      $scope.listUtil.add('catalogs', {
        name : 'All items',

      })

    });


    // listen for selection changes

    $scope.$on('catalogsSelectionChanged', function(event, row) {
      if (catalogView.api.grid.selection.selectedCount === 0) {

        $scope.$broadcast('redrawitems', []); // blank out items list since no single catalog is selected
      } else if (state.multipleItemsSelected) {
        $scope.$broadcast('redrawitems', []); // blank out items list since no single catalog is selected
      } else {
        // single catalog selection
        $scope.$broadcast('updateCatalogSubView', row[0].entity);
      }
    });


    // listen for display refreshes

    $scope.$on('redrawcatalogs', function(event, data) {
      catalogs = data;
      catalogView.selected = [];
    });

  });
