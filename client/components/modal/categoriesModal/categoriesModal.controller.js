'use strict';

angular.module('prindleApp')
  .controller('categoriesModalCtrl', ['$scope', 'appData', 'categoryService', 'gridService',
    function ($scope, appData, categoryService, gridService) {
      $scope.categories = appData.data.categories;
      $scope.displayCategories = appData.data.categories;

      $scope.removeCategory = function (category) {
        categoryService.delete(category)
          .then(function () {
            $scope.categories = appData.data.categories;
          });
      };

      var oldName;

      $scope.preUpdate = function (category) {
        oldName = category.name;
      };

      $scope.update = function (category) {
        if (category.name !== oldName) {
          categoryService.update(category, oldName);
        }
      };

      var toolCellTemplate = '<div class="toolCell">' +
        '<a href="#" ng-click="grid.appScope.removeCategory(row.entity)" ' +
        '<i class="fa fa-remove item-list-delete-tool">' +
        '</i></div>';


        $scope.categoryView = {
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

      $scope.categoryView.onRegisterApi = function (categoryViewApi) {


        $scope.categoryView.api = categoryViewApi;

        // set up event handlers for editing and selection
        gridService.registerSelectionEditEvents($scope, $scope.categoryView, 'categories');

        // set up keyboard events for this particular list
        gridService.registerKeyEvents($scope.categoryView);

      };


      $scope.$on('refresh-categories', function() {
        $scope.displayCategories = appData.data.categories;
      });

    }]);
