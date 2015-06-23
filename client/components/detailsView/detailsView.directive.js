'use strict';

angular.module('prindleApp')
  .directive('detailsView', function () {
    return {
      templateUrl: 'components/detailsView/detailsView.html',
      restrict: 'E',
      controller: 'detailsViewCtrl',
      link: function (scope, element, attrs) {

        scope.$on('items-selection-changed', function() {
          scope.currentItem = {};
          scope.currentItem = scope.getSelectedItem();
          scope.addImage(scope.currentItem, 'assets/images/clipart/tent.gif');
        });

//        scope.currentItem.imagePath = [];
//        scope.currentItem.imagePath = 'client/assets/images/clipart/tent.gif';



      }
    };
  })
  .controller('detailsViewCtrl', ['$scope', 'guiState', 'listUtil', function($scope, guiState, listUtil) {

    $scope.getSelectedItem = function() {
      if (guiState.state.items.selected.length === 1) {
        return guiState.state.items.selected[0];
      } else {
        return false;
      }

    };

    $scope.update = function() {
      var currentItem = $scope.getSelectedItem();
      listUtil.update('items', [currentItem]);
    };

    $scope.addImage = function(item, imagePath) {
      item.imagePath = imagePath;
    };
  }]);