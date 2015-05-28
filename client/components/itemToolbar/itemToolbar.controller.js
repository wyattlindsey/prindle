'use strict';

/**
 * Item Toolbar Controller - handles the binding of buttons in the toolbar above the
 * item list to actions handled in the list controllers
 */

angular.module('prindleApp')
  .controller('itemToolbarCtrl', function ($scope) {

    /**
     * addItemAction() - present dialog, take input and create new item
     */
    var i = 0;

    $scope.addItemAction = function() {
      $scope.listUtil.add('items',
        [{
          name: 'my new thing',
          weight: i++,
          category: 'stuff',
          readOnly: false,
          catalogs: []
        }]
      );
    };

      /**
       * copyItemAction() - copy selected items
       */

      $scope.copyItemAction = function() {


        if ($scope.data.displayItems.length === 0 || $scope.state.items.selected.length === 0) {
          return;
        } else {

          $scope.listUtil.copy('items', $scope.state.items.selected);

        }
      };

      /**
       * removeItemAction() - confirm and then delete selected items
       */

      $scope.removeItemFromCatalogAction = function() {

        if ($scope.data.displayItems.length === 0 || $scope.state.items.selected.length === 0 ||
              $scope.state.catalogs.selected.length > 1) {

          return;

        } else {

//          $scope.listUtil.delete('items', $scope.state.items.selected);

          // for now, changing this so that removing just removes from the catalog
          // only from one catalog at a time
          $scope.$parent.$broadcast('remove-items-from-catalog', {
            items: $scope.state.items.selected,
            catalog: $scope.state.catalogs.selected[0]
          });

        }
      };

      $scope.removeItemAction = function() {

        if ($scope.data.displayItems.length === 0 || $scope.state.items.selected.length === 0 ||
          $scope.state.catalogs.selected.length > 1) {

          return;

        } else {

            $scope.listUtil.delete('items', $scope.state.items.selected);


        }
      };


  });
