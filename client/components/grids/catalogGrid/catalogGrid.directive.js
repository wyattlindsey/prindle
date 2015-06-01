'use strict';

angular.module('prindleApp')
  .directive('catalogGrid', function () {
    return {
      templateUrl: 'components/grids/catalogGrid/catalogGrid.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
      }
    };
  });