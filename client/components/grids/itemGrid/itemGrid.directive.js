'use strict';

angular.module('prindleApp')
  .directive('itemGrid', function () {
    return {
      restrict: 'E',
      controller: 'itemGridCtrl',
      link: function (scope) {
        scope.initGrid();
      }
    };
  })
  .controller('itemGridCtrl', ['$scope', 'gridService', 'listUtil', 'guiState', 'itemViewService',
    function($scope, gridService, listUtil, guiState, itemViewService) {

      $scope.initGrid = function() {

        $scope.displayItems = [];

        /**
         * ui-grid setup
         */

        // draggable handles
        var dragCellTemplate = '<div x-lvl-draggable="true"><i class="fa fa-arrows item-list-drag-arrow"></i></div>';

        $scope.itemView = {
          data: 'displayItems',
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
        gridService.registerSelectionEditEvents($scope, $scope.itemView, 'items');

          // set up keyboard events for this particular list
        gridService.registerKeyEvents($scope.itemView);

        };

        // event listeners

        $scope.$on('refresh-items', function(event, items) {
          $scope.displayItems = itemViewService.refresh();
        });


        $scope.$on('catalogs-selection-changed', function() {
          $scope.displayItems = itemViewService.refresh();
        });


        $scope.$on('item-dropped', function(event, data) {
          itemViewService.dropItems(data);
        });


        // get initial data
        listUtil.get('items')
          .then(function(items) {
            itemViewService.loadData(items);
            $scope.$parent.$broadcast('items-loaded');
          });
      };



  }]);