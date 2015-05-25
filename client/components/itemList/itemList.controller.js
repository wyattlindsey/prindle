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
      $scope.$parent.$broadcast('redrawitems', $scope.data.items);
    });


    // set up ui-grid

    var dragCellTemplate = '<div x-lvl-draggable="true"><i class="fa fa-arrows item-list-drag-arrow"></i></div>';

    // does the itemView really need to be at the $scope?
    $scope.itemView = {
      data: '$parent.data.items',
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
      $scope.data.displayItems = itemList;
//      var tempList = [];
//
//      _.each(IDList, function(id) {
//        tempList.push(_.findWhere($scope.data.displayItems, { _id : id }));
//      });

      $scope.$parent.$broadcast('redrawitems', $scope.data.displayItems);

    };


    var addItemToCatalog = function(srcItem, destCatalog) {

      var foundInCatalogs = _.filter(srcItem.catalogs, function(catalog) {
        return catalog === destCatalog._id;
      });

      console.log(foundInCatalogs);

      if (foundInCatalogs.length === 0) {
        srcItem.catalogs.push(destCatalog._id);
        $scope.listUtil.update('items', [srcItem]);
      }

//      var foundInCatalogs = [];
//
//      foundInCatalogs = _.filter(srcItem.catalogs, function(catalog) {
//        return catalog === destCatalog._id;
//      });
//
//      if (foundInCatalogs === 'undefined') {
//        console.log('not found');
//        srcItem.catalogs.push(destCatalog._id);
//      }
//
//      console.log(srcItem.catalogs[0]);
//      var srcItemID = srcItem._id;
//      var match = _.find(destCatalog.items, function(item) {
//        return item === srcItemID;
//      });
//      if(!match) {
//        console.log('unique');
//        destCatalog.items.push(srcItemID);    // add dropped item to catalog items list
//
//        // this is not really updating permanently
//        $scope.listUtil.update('catalogs', [destCatalog]);
//      }
    };


    $scope.$on('itemDropped', function(event, data) {
      var srcEntity = angular.element(data.src).scope().$parent.row.entity;
      var destEntity = angular.element(data.dest).scope().$parent.row.entity;
      addItemToCatalog(srcEntity, destEntity);
    });


    $scope.$on('updateCatalogSubView', function (event, parentViewRow) {
      var catalogID = parentViewRow._id;

      var itemsInCatalog = _.filter($scope.data.items, function(item) {
        console.log(item.catalogs[0]);
        var matches = _.filter(item.catalogs, function(catalog) {

          return catalog === catalogID;
        });
//        console.log(matches);
      });

//      console.log(belongsToCatalogs);

//      updateItemsDisplay(belongsToCatalogs);
    });


    // listen for selection changes
    $scope.$on('itemsSelectionChanged', function(event, data) {
      if ($scope.state.items.multipleItemsSelected) {
//        console.log('multiple');
      } else {
//        console.log('single');
      }
    });


    // listen for display refreshes
    $scope.$on('redrawitems', function(event, data) {
      $scope.data.displayItems = data;
      $scope.itemView.selected = [];
    });

  });


