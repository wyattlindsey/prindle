'use strict';

angular.module('prindleApp')
  .controller('categoriesModalCtrl', ['$scope', 'appData', function ($scope, appData) {
    $scope.categories = appData.data.categories;
  }]);
