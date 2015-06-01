'use strict';

angular.module('prindleApp')
  .directive('itemGrid', function () {
    return {
      templateUrl: 'components/grids/itemGrid/itemGrid.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });