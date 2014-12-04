'use strict';

/**
 * Item Toolbar Controller - handles the binding of buttons in the toolbar above the
 * item list to actions handled in the list controllers
 */

angular.module('prindleApp')
  .controller('itemToolbarCtrl', function ($scope) {

      /**
       * copyItemAction() - copy selected items
       */

      $scope.copyItemAction = function() {

      };

      /**
       * removeItemAction() - confirm and then delete selected items
       */

      $scope.removeItemAction = function() {

      };

      /**
       * addItemAction() - present dialog, take input and create new item
       */

      $scope.addItemAction = function() {
        $scope.crud.add($scope.data, 'items', {
          name: 'Coile',
          weight: '200',
          category: 'Home'
        }).then(function() {
          $scope.crud.get($scope.data, 'items');
        });
      };
  });
