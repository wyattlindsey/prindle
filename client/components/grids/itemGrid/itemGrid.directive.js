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
  .controller('itemGridCtrl', ['$scope', 'gridService', 'itemViewService',
    function($scope, gridService, itemViewService) {

      $scope.initGrid = function() {

        $scope.displayItems = [];
        $scope.masterListSelected = {};
        $scope.masterListSelected.selected = false;

        /**
         * ui-grid setup
         */

        // draggable handles
        var dragCellTemplate = '<div x-lvl-draggable="true"><i class="fa fa-arrows item-list-drag-arrow"></i></div>';
//        var toolCellTemplate = '<div class="toolCell"><button ng-click="removeFromCatalog()" ng-hide="{{masterListSelected.selected}}" class="btn btn-xs btn-warning"><i class="fa fa-minus item-list-delete-tool"></i></button></div>';

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
            {
              field: 'null',
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
//            ,{ field: 'null',
//              displayName: '',
//              cellTemplate: toolCellTemplate,
//              enableSorting: false,
//              enableColumnMenu: false,
//              enableFiltering: false,
//              enableCellEdit: false,
//              width: 50
//            }
          ];

          // set up event handlers for editing and selection
        gridService.registerSelectionEditEvents($scope, $scope.itemView, 'items');

          // set up keyboard events for this particular list
        gridService.registerKeyEvents($scope.itemView);

        };


        // event listeners

        $scope.$on('refresh-items', function() {
          $scope.displayItems = itemViewService.refresh();
        });


        $scope.$on('deleted-from-items', function() {
          itemViewService.clearSelection();
        });


        $scope.$on('catalogs-selection-changed', function() {
          $scope.displayItems = itemViewService.refresh();
          itemViewService.clearSelection();
          $scope.masterListSelected.selected = itemViewService.masterListSelected();
        });


        itemViewService.loadData();
      };

    // it seems like angular actions in the cell template are not working
    $scope.removeFromCatalog = function() {
//      console.log('clicked');
    }

  }]);