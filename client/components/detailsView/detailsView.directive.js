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
        });

//        scope.$watch('files', function() {
////          console.log(scope.files);
//          if (scope.files) {
////            if (scope.files.length !== 0) {
////              console.log('I\'d buy that for a dollar');
////            }
////            console.log('hi');
//          }
//        });

      }
    };
  })
  .controller('detailsViewCtrl', ['$scope', 'guiState', 'listUtil', 'Upload', function($scope, guiState, listUtil, Upload) {

    $scope.getSelectedItem = function() {
      if (guiState.state.items.selected.length === 1) {
        return guiState.state.items.selected[0];
      } else {
        return false;
      }
    };

    $scope.update = function() {
      var currentItem = $scope.getSelectedItem();
      if(currentItem) {
        listUtil.update('items', [currentItem]);
      }
    };

    $scope.addImage = function(item, imagePath) {
      item.imagePath = imagePath;
      listUtil.update('items', [item]);
    };

    $scope.onFileSelect = function($files) {
      if ($files.length !== 0) {
        _uploadImage($files[0]);
      }
    };

    $scope.fileDropped = function($files, $event, $rejectedFiles) {
      if ($rejectedFiles.length === 0) {
        _uploadImage($files[0]);
      }
    };

    var _uploadImage = function(file) {
      Upload.upload({
        url: '/api/images/',
        file: file
      });
    };

  }]);