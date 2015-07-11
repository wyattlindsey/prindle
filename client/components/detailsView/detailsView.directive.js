'use strict';

angular.module('prindleApp')
  .directive('detailsView', function () {
    return {
      templateUrl: 'components/detailsView/detailsView.html',
      restrict: 'E',
      controller: 'detailsViewCtrl',
      link: function (scope, element, attrs, ctrl) {



        scope.$on('items-selection-changed', function() {
          scope.currentItem = {};
          scope.currentItem = scope.getSelectedItem();
          if (scope.currentItem) {
            scope.getImage(scope.currentItem);
          }
        });

      }
    };
  })
  .controller('detailsViewCtrl', ['$scope', 'guiState', 'listUtil', 'Upload',
    function($scope, guiState, listUtil, Upload) {

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
        listUtil.update('items', currentItem);
      }
    };

    $scope.onFileSelect = function($files) {
      if ($files && $files.length) {
        _uploadImage($files[0]);
      }
    };

    $scope.fileDropped = function($files, $event, $rejectedFiles) {
      if ($rejectedFiles.length === 0 && $files && $files.length) {
        _uploadImage($files[0]);
      }
    };

    var _uploadImage = function(file) {

      Upload.upload({
        url: '/api/images/',
        file: file
      })
        .success(function(data) {
          $scope.currentItem.imageID = data._id;
          listUtil.update('items', $scope.currentItem);
          $scope.getImage($scope.currentItem);
        });
    };

    $scope.getImage = function(currentItem) {
      listUtil.getImage(currentItem).then(function(data) {
        $scope.currentImage = 'images/' + data.name;
      });
    };

  }]);