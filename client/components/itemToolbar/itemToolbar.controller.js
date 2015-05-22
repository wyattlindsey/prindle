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
          readOnly: false
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

      $scope.removeItemAction = function() {

        if ($scope.data.displayItems.length === 0 || $scope.state.items.selected.length === 0) {
          console.log('no');

          return;

        } else {

          $scope.listUtil.delete('items', $scope.state.items.selected);

        }
      };


  });
