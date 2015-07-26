'use strict';

angular.module('prindleApp')
  .directive('categoryGrid', function () {
    return {
      restrict: 'E',
      controller: 'categoryGridCtrl',
      transclude: true,
      link: function (scope) {
//        console.log(scope);
        scope.initGrid();
      }
    };
  })
  .controller('categoryGridCtrl', ['$scope', 'gridService', 'listUtil', 'appData',
    function($scope, gridService, listUtil, appData) {

      $scope.displayCategories = appData.data.categories;

      $scope.initGrid = function() {

//        console.log(categoryView);

        $scope.categoryView = {
          data: 'displayCategories',
          enableFiltering: true,
          enableRowSelection: true,
          multiSelect: false,
          columnDefs: [
            {field: 'name', displayName: 'Categories'}
          ],
          enableRowHeaderSelection: false,
          rowTemplate: '<div x-lvl-drop-target="true" x-on-drop="droppedOnCategory(dragEl, dropEl)" ng-click="grid.appScope.fnOne(row)" ' +
            'ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>'
        };


        $scope.categoryView.onRegisterApi = function(categoryViewApi) {

//          console.log('api registration');

          $scope.categoryView.api = categoryViewApi;

//          $scope.categoryView.columnDefs = [
//            {field: 'name', displayName: 'Categories'}
//          ];

          // set up event handlers for editing and selection
          gridService.registerSelectionEditEvents($scope, $scope.categoryView, 'categories');

          // set up keyboard events for this particular list
          gridService.registerKeyEvents($scope.categoryView);

        };

//        // event listeners
//
//        $scope.$on('refresh-catalogs', function() {
//          $scope.displayCatalogs = catalogViewService.refresh();
//        });
//
//        $scope.$on('added-to-items', function(event, newItems) {
//          catalogViewService.addItemsToCatalog(newItems);
//          $scope.$parent.$broadcast('refresh-items');
//        });
//
//        $scope.$on('deleted-from-catalogs', function() {
//          catalogViewService.clearSelection();
//        });
//
//        $scope.$on('deleted-from-items', function(event, item) {
//          catalogViewService.deleteItemsFromCatalogs([item]);
//        });
//
//        $scope.$on('item-dropped', function(event, data) {
//          catalogViewService.dropItems(data);
//        });
//
//        // get initial data
//        $scope.$on('items-loaded', function() {
//          $scope.displayCatalogs = catalogViewService.loadData();
//        });


      };

    }]);