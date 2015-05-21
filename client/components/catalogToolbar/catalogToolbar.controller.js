'use strict';

/**
 * Catalog Toolbar Controller - handles the binding of buttons in the toolbar above the
 * catalog list to actions handled in the list controllers
 */

angular.module('prindleApp')
  .controller('catalogToolbarCtrl', function ($scope) {

    var catalogs = $scope.data.catalogs;
    var state = $scope.state.catalogs;

    /**
     * addCatalogAction() - ideally create new collection with edit action enabled
     */


    $scope.addCatalogAction = function() {

      var itemList = [$scope.$parent.data.items[2]._id, $scope.$parent.data.items[3]._id, $scope.$parent.data.items[1]._id];

      $scope.listUtil.add('catalogs',
        [{
            name : 'my new list of things',
            items : itemList
          }
        ]
      );

    };

    /**
     * copyCatalogAction() - copy selected collections
     */

    $scope.copyCatalogAction = function() {

      if (typeof catalogs  === 'undefined' || catalogs.list.length === 0 ||
        state.selected.length === 0) {
        return;
      } else {

        $scope.listUtil.copy('catalogs', state.selected);

      }
    };

    /**
     * removeCatalogAction() - confirm, then delete collections
     */

    $scope.removeCatalogAction = function() {

      if (typeof catalogs  === 'undefined' || catalogs.list.length === 0 ||
        state.selected.length === 0) {

        return;

      } else {

        $scope.listUtil.delete('catalogs', state.selected);

      }
    };
  });
