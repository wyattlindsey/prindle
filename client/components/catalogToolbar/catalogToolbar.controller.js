'use strict';

/**
 * Catalog Toolbar Controller - handles the binding of buttons in the toolbar above the
 * catalog list to actions handled in the list controllers
 */

angular.module('prindleApp')
  .controller('catalogToolbarCtrl', function ($scope) {


    /**
     * addCatalogAction() - ideally create new collection with edit action enabled
     */


    $scope.addCatalogAction = function() {

      $scope.listUtil.add('catalogs',
        [{
            name : 'my new thing'
          },
          {
            name: 'Wyatt'
          }
        ]);
    };
    /**
     * copyCatalogAction() - copy selected collections
     */

    var catalogs = $scope.data.catalogs;

    $scope.copyCatalogAction = function() {

      if (typeof catalogs  === 'undefined' || catalogs.list.length === 0 ||
        catalogs.selected.length === 0) {
        return;
      } else {

        $scope.listUtil.copy('catalogs', catalogs.selected);

      }
    };

    /**
     * removeCatalogAction() - confirm, then delete collections
     */

    $scope.removeCatalogAction = function() {

      if (typeof catalogs  === 'undefined' || catalogs.list.length === 0 ||
        catalogs.selected.length === 0) {

        return;

      } else {

        $scope.listUtil.delete('catalogs', catalogs.selected);

      }
    };
  });
