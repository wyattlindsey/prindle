'use strict';

angular.module('prindleApp')
  .directive('catalogToolbar', function () {
    return {
      templateUrl: 'components/listToolbar/catalogToolbar/catalogToolbar.html',
      restrict: 'A',
      require: '^listToolbar',
      link: function (scope, element, attrs, listToolbarCtrl) {
        scope.addCatalogsAction = function() {
          listToolbarCtrl.add();
        };

        scope.copyCatalogsAction = function() {
          listToolbarCtrl.copy();
        };

        scope.deleteCatalogsAction = function() {
          listToolbarCtrl.delete();
        };
      }
    };
  });