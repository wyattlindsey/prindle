'use strict';

angular.module('prindleApp')
  .controller('CategorygridCtrl', ['$scope', 'appData', 'categoryService', 'gridService',
    function ($scope, appData, categoryService, gridService) {

      $scope.displayCategories = appData.data.categories;
      $scope.displayItemsInCategory = $scope.getItemsForCategory();

      var toolCellTemplate = '<div class="toolCell">' +
        '<a href="#" ng-click="grid.appScope.removeCategory(row.entity)" ' +
        '<i class="fa fa-remove item-list-delete-tool">' +
        '</i></div>';


      this.view = {
        data: 'displayCategories',
        enableFiltering: true,
        enableRowSelection: true,
        multiSelect: false,
        columnDefs: [
          {
            field: 'null',
            displayName: '',
            cellTemplate: toolCellTemplate,
            enableSorting: false,
            enableColumnMenu: false,
            enableFiltering: false,
            enableCellEdit: false,
            width: 50
          },
          {
            field: 'name', displayName: 'Categories'
          }
        ],
        enableRowHeaderSelection: false,
        rowTemplate: '<div x-lvl-drop-target="true" x-on-drop="droppedOnCategory(dragEl, dropEl)" ng-click="grid.appScope.fnOne(row)" ' +
          'ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>'
      };

      this.onRegisterApi = function (categoryViewApi) {


//        $scope.categoryView.api = categoryViewApi;

        // set up event handlers for editing and selection
//        gridService.registerSelectionEditEvents($scope, $scope.categoryView, 'categories');

        // set up keyboard events for this particular list
//        gridService.registerKeyEvents($scope.categoryView);

      };

//
//      $scope.$on('refresh-categories', function () {
//        $scope.displayCategories = appData.data.categories;
//      });
    }]);
