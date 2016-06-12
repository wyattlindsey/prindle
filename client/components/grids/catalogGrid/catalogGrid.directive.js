'use strict';

angular.module('prindleApp')
  .directive('catalogGrid', function () {
    return {
      restrict: 'E',
      controller: 'catalogGridCtrl',
      link: function (scope, element, attrs, ctrl) {
        ctrl.initGrid();
      }
    };
  })
  .controller('catalogGridCtrl', ['$scope', 'gridService', 'catalogViewService',
      function($scope, gridService, catalogViewService) {

    $scope.displayCatalogs = [];

        /**
         * for some reason item IDs aren't being removed properly from catalogs when the items are deleted
         */

    this.initGrid = function() {
      $scope.catalogView = {
        data: 'displayCatalogs',
        enableFiltering: true,
        enableRowSelection: true,
        multiSelect: false,
        enableRowHeaderSelection: false,
        rowTemplate: '<div x-lvl-drop-target="true" x-on-drop="droppedOnCatalog(dragEl, dropEl)" ng-click="grid.appScope.fnOne(row)" ' +
          'ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>'
      };

      $scope.catalogView.onRegisterApi = function(catalogViewApi) {

        $scope.catalogView.api = catalogViewApi;

        $scope.catalogView.columnDefs = [
          {field: 'name', displayName: 'Catalogs'}
        ];

        // set up event handlers for editing and selection
        gridService.registerSelectionEditEvents($scope, $scope.catalogView, 'catalogs');

        // set up keyboard events for this particular list
        gridService.registerKeyEvents($scope.catalogView);

      };

      // event listeners

      $scope.$on('refresh-catalogs', function() {
        $scope.displayCatalogs = catalogViewService.refresh();
      });

      $scope.$on('added-to-catalogs', function() {
        $scope.displayCatalogs = catalogViewService.refresh();
      });

      $scope.$on('added-to-items', function(event, newItems) {
        catalogViewService.addItemsToCatalog(newItems);
        $scope.$parent.$broadcast('refresh-items');
      });

      $scope.$on('deleted-from-catalogs', function() {
        $scope.displayCatalogs = catalogViewService.refresh();
        catalogViewService.clearSelection();
      });

      $scope.$on('deleted-from-items', function(event, item) {
        catalogViewService.deleteItemsFromCatalogs([item]);
      });

      $scope.$on('item-dropped', function(event, data) {
        catalogViewService.dropItems(data);
      });

      // get initial data
      $scope.$on('items-loaded', function() {
        $scope.displayCatalogs = catalogViewService.loadData();
      });


    };

  }]);
