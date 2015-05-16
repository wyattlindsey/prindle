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

        if (typeof $scope.data.catalogs  === 'undefined') {

          return;

        } else {

          var qtyItemsToDelete = $scope.data.catalogs.selected.length;

          var removeCatalogItem = function(index) {
            (function(index) {
              if (index >= 0) {
                $scope.crud.remove('catalogs', $scope.data.catalogs.list[index]._id)
                  .then(function() {
                    // only do a GET after the last item deleted
                    if (index === 0) {
                      $scope.crud.get('catalogs')
                        .then(function(data) {
                          $scope.data.catalogs.list = data;
                        });
                    }
                  });
                // recursively call removal function
                removeCatalogItem(--index);
              }
            })(index);

          };
          // first call to recursive function
          removeCatalogItem(qtyItemsToDelete - 1);
        }
      };

      /**
       * addCatalogAction() - ideally create new collection with edit action enabled
       */

      var i = 0;

      $scope.addCatalogAction = function() {
        $scope.crud.add('catalogs', {
          name: 'totally brand new ' + i++
        })
        .then(function() {
          $scope.crud.get('catalogs')
            .then(function(data) {
              $scope.data.catalogs.list = data;
            });
        });
      };
  });
