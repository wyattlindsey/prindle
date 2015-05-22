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


    // does the itemView really need to be at the $scope?
    $scope.itemView = {
      data: '$parent.data.displayItems',
      enableFiltering: true,
      enableRowSelection: true,
      multiSelect: false,
      enableRowHeaderSelection: false,
      rowTemplate: '<div x-lvl-draggable="true" style="" ng-click="grid.appScope.fnOne(row)" ' +
        'ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>'
    };

    // initialize grid

    $scope.itemView.onRegisterApi = function(itemViewApi) {
      $scope.itemView.api = itemViewApi;

      // set up columns

      $scope.itemView.columnDefs = [
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

    var updateItemsDisplay = function(IDList) {
      $scope.data.displayItems = [];
      var tempList = [];
      _.each(IDList, function(id) {

        tempList.push(_.findWhere($scope.data.items, { _id : id }));

      });

      $scope.$parent.$broadcast('redrawitems', tempList);

    };

    $scope.$on('updateCatalogSubView', function (event, parentViewRow) {
      updateItemsDisplay(parentViewRow.items);
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


