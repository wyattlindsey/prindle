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
//          scope.manageCategories();
          unregisterCategoriesLoaded();
        });

        scope.currentItem = null;

        scope.$on('items-selection-changed', function () {
          scope.updateDetailsView();
        });

      }
    };
  })
  .controller('detailsViewCtrl', ['$scope', '$timeout', 'guiState', 'appData', 'listUtil', 'Upload', 'Modal', 'categoryService',
    function ($scope, $timeout, guiState, appData, listUtil, Upload, Modal, categoryService) {

      var lastItemSelected;

      $scope.updateDetailsView = function() {
        // the goal here is to make sure that detailsView doesn't go in and out quickly when
        // editing items in the itemView

        // really just need to defer the updating of the view in general.  maybe the timeout
        // should go in the listener, check to see if no new selection changes for
        // so many milliseconds before then updating the view, but without it seeming slow
        // hmm maybe selection changes themselves should happen in quick succession?
        // or how about just leave the details view up until a new item is selected?
        // does that violate a ui principle?

        var selectedItem = $scope.getSelectedItem();
        var qtyItemsSelected = guiState.state.items.selected.length;
        var selectingSingle = qtyItemsSelected === 1;

        if (!lastItemSelected && selectingSingle) {
          lastItemSelected = selectedItem;
          $scope.currentItem = selectedItem;
          $scope.getImage($scope.currentItem);
        }

        if (selectingSingle) {
          if (lastItemSelected._id === selectedItem._id) {
            // do nothing view update wise
          } else if (selectingSingle) {
            lastItemSelected = selectedItem;
            $scope.currentItem = selectedItem;
            $scope.getImage($scope.currentItem);
          }
        }

      };

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
        Modal.category(function() {
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