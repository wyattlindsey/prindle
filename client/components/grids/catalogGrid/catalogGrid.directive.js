'use strict';

angular.module('prindleApp')
  .directive('catalogGrid', function () {
    return {
      restrict: 'E',
      controller: 'catalogGridCtrl',
      link: function (scope) {
        scope.initGrid();
      }
    };
  })
  .controller('catalogGridCtrl', ['$scope', 'gridService', 'listUtil', 'appData',
      function($scope, gridService, listUtil, appData) {

    $scope.initGrid = function() {
      $scope.appData = appData;
      $scope.catalogView = {
        data: 'appData.data.catalogs',
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

      $scope.$on('refresh-catalogs', function(event, catalogs) {
        refresh(catalogs);
      });

      // get initial data
      listUtil.get('catalogs')
        .then(function(catalogs) {
          refresh(catalogs);
        });
    };

    var refresh = function(catalogs) {
      if (typeof catalogs !== 'undefined') {
        appData.data.catalogs = catalogs;
      }
    };

  }]);