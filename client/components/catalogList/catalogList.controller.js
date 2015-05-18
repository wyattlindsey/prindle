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

      // set up event handlers for editing and selection
      $scope.gridService.registerSelectionEditEvents($scope, catalogView, $scope.state.catalogs, 'catalogs');

      // set up keyboard events for this particular list
      $scope.gridService.registerKeyEvents($scope.catalogView);

    };

    // listen for display refreshes
    $scope.$on('redrawcatalogs', function(event, data) {
      catalogs.list = data;
      catalogView.selected = [];
    });

  });
