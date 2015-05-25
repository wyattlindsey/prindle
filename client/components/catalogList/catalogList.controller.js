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

    var addItemToCatalog = function(srcItem, destCatalog) {
      var srcItemID = srcItem._id;
      var match = _.find(destCatalog.items, function(item) {
        return item === srcItemID;
      });
      if(!match) {
        console.log('unique');
        destCatalog.items.push(srcItemID);    // add dropped item to catalog items list

        // this is not really updating permanently
        $scope.listUtil.update('catalogs', [destCatalog]);
      }
    };


    // initialize master list

    $scope.$on('startupItemsLoaded', function() {
      if (typeof $scope.data.catalogs[0] === 'undefined') {
        var itemIDs = [];

        _.forEach($scope.data.items, function(item, index) {
          itemIDs[index] = item._id;
        });

        $scope.listUtil.add('catalogs', [{
          name: 'All items',
          items: itemIDs,
          readOnly: true
        }]);
        $scope.$broadcast('redrawcatalogs', $scope.data.catalogs);
      }
    });

    $scope.$on('addedtoitems', function(event, data) {
//      addItemToCatalog(data, $scope.data.catalogs[0]);
    });

    $scope.$on('deletedfromitems', function(event, data) {
      console.log(data);
    });


    // listen for selection changes

    $scope.$on('catalogsSelectionChanged', function(event, row) {
      if ($scope.catalogView.api.grid.selection.selectedCount === 0) {
        $scope.$parent.$broadcast('redrawitems', []); // blank out items list since no single catalog is selected
      } else if ($scope.state.catalogs.multipleItemsSelected) {
        $scope.$parent.$broadcast('redrawitems', []); // blank out items list since no single catalog is selected
      } else {
        // single catalog selection
        $scope.$parent.$broadcast('updateCatalogSubView', row[0].entity);
      }
    });


    // listen for display refreshes

    $scope.$on('redrawcatalogs', function(event, data) {
      $scope.$parent.data.catalogs = data;
      $scope.catalogView.selected = [];
    });

    $scope.$on('itemDropped', function(event, data) {
      var srcEntity = angular.element(data.src).scope().$parent.row.entity;
      var destEntity = angular.element(data.dest).scope().$parent.row.entity;
      addItemToCatalog(srcEntity, destEntity);
    });


  });
