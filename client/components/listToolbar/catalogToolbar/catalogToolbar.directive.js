'use strict';

angular.module('prindleApp')
  .directive('catalogToolbar', function () {
    return {
      templateUrl: 'components/listToolbar/catalogToolbar/catalogToolbar.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
      }
    };
  });