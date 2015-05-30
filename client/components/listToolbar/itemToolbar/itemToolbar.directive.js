'use strict';

angular.module('prindleApp')
  .directive('itemToolbar', function () {
    return {
      templateUrl: 'components/listToolbar/itemToolbar/itemToolbar.html',
      restrict: 'A',
      require: '^listToolbar',
      link: function (scope, element, attrs, listToolbarCtrl) {
        scope.addItemsAction = function() {
          listToolbarCtrl.add();
        };

        scope.copyItemsAction = function() {
          listToolbarCtrl.copy();
        };

        scope.deleteItemsAction = function() {
          listToolbarCtrl.delete();
        };
      }
    };
  });