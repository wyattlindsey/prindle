'use strict';

/**
 * listGridCtrl handles the main list of items that are displayed in ui-grid based on the
 * list selection in the meta list
 */

angular.module('prindleApp')
  .controller('itemListCtrl', function ($scope) {

    var items = $scope.data.items;
    var displayItems = $scope.data.displayItems;
    var state = $scope.state.items;


    // set up shallow reference from real data to display data
    $scope.$parent.$on('itemsLoaded', function() {
      angular.extend($scope.data.displayItems, $scope.data.items);
    });


    // set up ui-grid

    $scope.itemView = {
      data: 'data.displayItems',
      enableFiltering: true,
      enableRowSelection: true,
      multiSelect: false,
      enableRowHeaderSelection: false
    };

    var itemView = $scope.itemView;


    itemView.onRegisterApi = function(itemViewApi) {
      itemView.api = itemViewApi;

      // set up columns

      itemView.columnDefs = [
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
      $scope.gridService.registerSelectionEditEvents($scope, itemView, $scope.state.items, 'items');

      // set up keyboard events for this particular list
      $scope.gridService.registerKeyEvents(itemView);
    };

    // listen for display refreshes
    $scope.$on('redrawitems', function(event, data) {
      $scope.data.displayItems = data;
      itemView.selected = [];
    });

  });


