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

//      var itemList = [$scope.$parent.data.items[0]._id];

      $scope.listUtil.add('catalogs',
        [{
            name : 'my new list of things'
//            items : itemList
          }
        ]
      );

    };

    /**
     * copyCatalogAction() - copy selected collections
     */

    $scope.copyCatalogAction = function() {

      if (typeof $scope.data.catalogs  === 'undefined' || $scope.data.catalogs.length === 0 ||
        $scope.state.catalogs.selected.length === 0) {
        return;
      } else {

        $scope.listUtil.copy('catalogs', state.selected);

      }
    };

    /**
     * removeCatalogAction() - confirm, then delete collections
     */

    $scope.removeCatalogAction = function() {

      if (typeof $scope.data.catalogs  === 'undefined' || $scope.data.catalogs.length === 0 ||
        $scope.state.catalogs.selected.length === 0) {

        return;

      } else {

        $scope.listUtil.delete('catalogs', $scope.state.catalogs.selected);

      }
    };
  });
