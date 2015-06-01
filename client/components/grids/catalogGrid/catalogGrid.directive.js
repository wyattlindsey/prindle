'use strict';

angular.module('prindleApp')
  .directive('catalogGrid', function () {
    return {
      restrict: 'E',
      scope: true,
      controller: 'catalogGridCtrl',
      link: function (scope, element, attrs, ctrl) {
        ctrl.initializeGrid();
      }
    };
  })
  .controller('catalogGridCtrl', ['$scope', function($scope) {
    this.initializeGrid = function() {
      $scope.catalogView = {
        data: 'data.catalogs',
        enableFiltering: true,
        enableRowSelection: true,
        multiSelect: false,
        enableRowHeaderSelection: false,
        rowTemplate: '<div x-lvl-drop-target="true" x-on-drop="droppedOnCatalog(dragEl, dropEl)" ng-click="grid.appScope.fnOne(row)" ' +
          'ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>'
      };

      // initialize grid

      $scope.catalogView.onRegisterApi = function(catalogViewApi) {

        $scope.catalogView.api = catalogViewApi;

        $scope.catalogView.columnDefs = [
          {field: 'name', displayName: 'Catalogs'}
        ];

        // set up event handlers for editing and selection
        $scope.gridService.registerSelectionEditEvents($scope, $scope.catalogView, 'catalogs');

        // set up keyboard events for this particular list
        $scope.gridService.registerKeyEvents($scope.catalogView);

      };
    }
  }]);