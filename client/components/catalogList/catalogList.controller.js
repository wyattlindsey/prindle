'use strict';

/**
 * The list of lists and other collections
 */

angular.module('prindleApp')
  .controller('catalogListCtrl', function ($scope) {



    // set up ui-grid instance

    $scope.catalogView = {
      data: 'data.catalogs',
      enableFiltering: true,
      enableRowSelection: true,
      multiSelect: false,
      enableRowHeaderSelection: false,
      rowTemplate: '<div x-lvl-drop-target="true" x-on-drop="droppedOnCatalog(dragEl, dropEl)" ng-click="grid.appScope.fnOne(row)" ' +
        'ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>'
    };

    // initialize grid

    $scope.catalogView.onRegisterApi = function(catalogViewApi) {

      $scope.catalogView.api = catalogViewApi;

      $scope.catalogView.columnDefs = [
        {field: 'name', displayName: 'Catalogs'}
      ];

      // set up event handlers for editing and selection
      $scope.gridService.registerSelectionEditEvents($scope, $scope.catalogView, $scope.state.catalogs, 'catalogs');

      // set up keyboard events for this particular list
      $scope.gridService.registerKeyEvents($scope.catalogView);

    };




    // initialize master list

    $scope.$on('startup-items-loaded', function() {
      if (typeof $scope.data.catalogs[0] === 'undefined') {
        var itemIDs = [];

        _.forEach($scope.data.items, function(item, index) {
          itemIDs[index] = item._id;
        });

        $scope.listUtil.add('catalogs', [{
          name: 'All items',
          items: itemIDs,
          readOnly: true
        }]).then(function() {
          $scope.$parent.$broadcast('master-catalog-loaded', $scope.data.catalogs[0]);
        });
      }
    });


    $scope.$on('deleted-from-catalogs', function(event, catalog) {
      $scope.$parent.$broadcast('update-items-catalog-deleted', catalog._id);
    });


    $scope.$on('catalogs-selection-changed', function(event, row) {
      $scope.$parent.$broadcast('refresh-items');
    });


    $scope.$on('refresh-catalogs', function(event, catalogs) {
      if (typeof catalogs !== 'undefined') {
        $scope.data.catalogs = catalogs;
      }
    });
  });
