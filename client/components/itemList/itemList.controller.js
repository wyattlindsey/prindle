'use strict';

/**
 * listGridCtrl handles the main list of items that are displayed in ui-grid based on the
 * list selection in the meta list
 */

angular.module('prindleApp')
  .controller('itemListCtrl', function ($scope) {


    // set up shallow reference from real data to display data

    $scope.$on('startupItemsLoaded', function() {
      angular.extend($scope.data.displayItems, $scope.data.items);
      $scope.$parent.$broadcast('redrawitems', []);
    });


    // set up ui-grid

    var dragCellTemplate = '<div x-lvl-draggable="true"><i class="fa fa-arrows item-list-drag-arrow"></i></div>';

    // does the itemView really need to be at the $scope?
    $scope.itemView = {
      data: '$parent.data.displayItems',
      enableFiltering: true,
      enableRowSelection: true,
      multiSelect: false,
      enableRowHeaderSelection: false
    };

    // initialize grid

    $scope.itemView.onRegisterApi = function(itemViewApi) {
      $scope.itemView.api = itemViewApi;

      // set up columns

      $scope.itemView.columnDefs = [
        { field: 'null',
          displayName: '',
          cellTemplate: dragCellTemplate,
          enableSorting: false,
          enableColumnMenu: false,
          enableFiltering: false,
          enableCellEdit: false,
          width: 50
        },
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


      // set up event handlers for editing and selection

      $scope.gridService.registerSelectionEditEvents($scope, $scope.itemView, $scope.state.items, 'items');

      // set up keyboard events for this particular list

      $scope.gridService.registerKeyEvents($scope.itemView);
    };


    var updateItemsDisplay = function(itemList) {
      $scope.data.displayItems = [];
      angular.extend($scope.data.displayItems, itemList);
      $scope.$parent.$broadcast('redraw-items', $scope.data.displayItems);

    };


    var addItemsToCatalog = function(srcItems, destCatalog) {

      var itemsToUpdate = [];


      _.forEach(srcItems, function(item) {
        var foundInCatalogs = _.filter(item.catalogs, function(catalog) {
          return catalog === destCatalog._id;
        });

        if (foundInCatalogs.length === 0) {
          item.catalogs.push(destCatalog._id);
          itemsToUpdate.push(item);
        }
      });

      $scope.listUtil.update('items', itemsToUpdate)
        .then(function() {
          console.log($scope.data);
        });
    };


    $scope.$on('master-catalog-loaded', function(event, catalog) {
      // master catalog should contain all items currently in the collection
      addItemsToCatalog($scope.data.items, catalog);
    });


    $scope.$on('item-dropped', function(event, data) {
      var srcEntity = angular.element(data.src).scope().$parent.row.entity;
      var destEntity = angular.element(data.dest).scope().$parent.row.entity;
      addItemsToCatalog([srcEntity], destEntity);
    });


    $scope.$on('update-catalog-subview', function (event, parentViewRow) {
      var catalogID = parentViewRow._id;

      var itemsInCatalog = _.filter($scope.data.items, function(item) {
        var matches = _.filter(item.catalogs, function(catalog) {
          return catalog === catalogID;
        });
        return matches.length > 0;
      });
      updateItemsDisplay(itemsInCatalog);
    });


    $scope.$on('added-to-items', function(event, data) {
      // add any new item to the master list
      console.log($scope.data);
      addItemsToCatalog([data], $scope.data.catalogs[0]);
    });


    // listen for selection changes
    $scope.$on('items-selection-changed', function(event, data) {
      if ($scope.state.items.multipleItemsSelected) {
//        console.log('multiple');
      } else {
//        console.log('single');
      }
    });


    $scope.$on('refresh-items-data', function(event, items) {
      $scope.data.items = items;
    });


    // listen for display refreshes
    $scope.$on('redraw-items', function(event, data) {
      $scope.data.displayItems = data;
      $scope.itemView.selected = [];
    });

  });


