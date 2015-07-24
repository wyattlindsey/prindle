'use strict';

angular.module('prindleApp')
  .controller('categoriesModalCtrl', ['$scope', 'appData', 'categoryService', function ($scope, appData, categoryService) {
    $scope.categories = appData.data.categories;

    $scope.removeCategory = function(category) {
      categoryService.delete(category)
        .then(function() {
          $scope.categories = appData.data.categories;
        });
    };

  }]);
