'use strict';

angular.module('prindleApp')
  .directive('detailsView', function () {
    return {
      templateUrl: 'components/detailsView/detailsView.html',
      restrict: 'E',
      controller: 'detailsViewCtrl',
      link: function (scope, element, attrs, ctrl) {

        var unregisterCategoriesLoaded = scope.$on('categories-loaded', function () {
          scope.getCategories();
          unregisterCategoriesLoaded();
        });

        scope.$on('items-selection-changed', function () {
          scope.currentItem = {};
          scope.currentItem = scope.getSelectedItem();
          if (scope.currentItem) {
            scope.getImage(scope.currentItem);
          }
        });

      }
    };
  })
  .controller('detailsViewCtrl', ['$scope', 'guiState', 'appData', 'listUtil', 'Upload', 'Modal', 'categoryService',
    function ($scope, guiState, appData, listUtil, Upload, Modal, categoryService) {

      $scope.getSelectedItem = function () {
        if (guiState.state.items.selected.length === 1) {
          return guiState.state.items.selected[0];
        } else {
          return false;
        }
      };

      $scope.getCategories = function() {
        $scope.categories = appData.data.categories;
      };


      $scope.update = function () {
        var currentItem = $scope.getSelectedItem();
        if (currentItem) {
          listUtil.update('items', currentItem);
        }
      };


      $scope.selectCategory = function(name) {
        if ($scope.currentItem.category !== name) {
          $scope.currentItem.category = name;
          listUtil.update('items', $scope.currentItem);
        }
      };


      $scope.addNewCategory = function() {
        Modal.singleField(function(newCategory) {
          categoryService.add(newCategory)
            .then(function() {
              $scope.getCategories();
              $scope.selectCategory(newCategory);
            });
        })('Add new category');
      };


      $scope.manageCategories = function () {
        Modal.categories(function() {
          $scope.getCategories();
        })('Manage Categories');
      };


      $scope.onFileSelect = function ($files) {
        if ($files && $files.length) {
          _uploadImage($files[0]);
        }
      };


      $scope.fileDropped = function ($files, $event, $rejectedFiles) {
        if ($rejectedFiles.length === 0 && $files && $files.length) {
          _uploadImage($files[0]);
        }
      };


      var _uploadImage = function (file) {

        Upload.upload({
          url: '/api/images/',
          file: file,
          fields: {'isClipArt': false}
        })
          .success(function (data) {
            $scope.currentItem.imageID = data._id;
            listUtil.update('items', $scope.currentItem);
            $scope.getImage($scope.currentItem);
          });
      };


      $scope.getImage = function (currentItem) {
        listUtil.getImage(currentItem).then(function (data) {
          if (data._id) {
            $scope.currentItem.imageID = data._id;

            if (data.isClipArt) {
              $scope.currentImage = 'images/clipart' + data.name;
            } else {
              $scope.currentImage = 'images/' + data.name;
            }
          }
        });
      };

    }]);