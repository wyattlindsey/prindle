'use strict';

/**
 * Catalog Toolbar Controller - handles the binding of buttons in the toolbar above the
 * catalog list to actions handled in the list controllers
 */

angular.module('prindleApp')
  .controller('catalogToolbarCtrl', function ($scope) {

      /**
       * copyCatalogAction() - copy selected collections
       */

      $scope.copyCatalogAction = function() {

      };

      /**
       * removeCatalogAction() - confirm, then delete collections
       */

      $scope.removeCatalogAction = function() {

      };

      /**
       * addCatalogAction() - ideally create new collection with edit action enabled
       */

      $scope.addCatalogAction = function() {
        $scope.crud.add($scope.data, 'catalogs', {
          name: 'totally brand new'
        });
      };
  });
