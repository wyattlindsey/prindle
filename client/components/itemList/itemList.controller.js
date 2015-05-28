'use strict';

/**
 * listGridCtrl handles the main list of items that are displayed in ui-grid based on the
 * list selection in the meta list
 */

angular.module('prindleApp')
  .controller('itemListCtrl', function ($scope, $rootScope) {





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

      $scope.listUtil.update('items', itemsToUpdate);
    };


    var removeItemsFromCatalog = function(catalog) {
      var itemsWithChanges = [];
      _.forEach($scope.data.items, function(item) {
        console.log(item);
        _.forEach(item.catalogs, function(id, index) {
          if (catalog._id === id) {
            item.catalogs.splice(index, 1);
            itemsWithChanges.push(item);
          }
        });
      });
      $scope.listUtil.update('items', itemsWithChanges);
      updateView();
    };


    $scope.$on('master-catalog-loaded', function(event, catalog) {
      // master catalog should contain all items currently in the collection
      // this should fire only when the app initializes the first time
      addItemsToCatalog($scope.data.items, catalog);
    });


    $scope.$on('startup-items-loaded', function(event, data) {
      $scope.$parent.$broadcast('refresh-items', data);
    });


    $scope.$on('item-dropped', function(event, data) {
      var sourceItems = [];
      if ($scope.state.items.selected.length > 0) {
        sourceItems = $scope.state.items.selected;
      }
      sourceItems.push(angular.element(data.src).scope().$parent.row.entity);
      var destEntity = angular.element(data.dest).scope().$parent.row.entity;
      addItemsToCatalog(sourceItems, destEntity);
    });


    $scope.$on('added-to-items', function(event, data) {
      // add any new item to the master list
      addItemsToCatalog(data, $scope.data.catalogs[0]);

      // if there are catalog selections, also add this to that list,
      // but for now, only do that when one catalog is selected
      if ($scope.state.catalogs.selected.length === 1) {
        addItemsToCatalog(data, $scope.state.catalogs.selected[0]);
      }
    });


    $scope.$on('copied-catalogs', function(event, data) {
      var itemsFromSourceCatalog = [];
      _.forEach($scope.data.items, function(item) {
        _.forEach(item.catalogs, function(catalog) {
          if (catalog === data.src._id) itemsFromSourceCatalog.push(item);
        });
      });

      console.log(itemsFromSourceCatalog);

      addItemsToCatalog(itemsFromSourceCatalog, data.dest);
    });


    $scope.$on('catalog-deleted', function(event, catalog) {
      removeItemsFromCatalog(catalog);
    });


    // listen for selection changes
    $scope.$on('items-selection-changed', function(event, data) {
      if ($scope.state.items.multipleItemsSelected) {
//        console.log('multiple');
      } else {
//        console.log('single');
      }
    });


    $scope.$on('refresh-items', function(event, items) {
      if (typeof items !== 'undefined') {
        $scope.data.items = items;
      }
      updateView($scope.state.catalogs.selected);
    });

    var updateView = function(parentView) {
      if (typeof parentView !== 'undefined' && parentView.length === 1) {
        var catalogID = parentView[0]._id;

        var itemsInCatalog = _.filter($scope.data.items, function(item) {
          var matches = _.filter(item.catalogs, function(catalog) {
            return catalog === catalogID;
          });
          return matches.length > 0;
        });
        $scope.data.displayItems = [];
        angular.extend($scope.data.displayItems, itemsInCatalog);

      } else {
        $scope.data.displayItems = [];
      }

    };

  });


