'use strict';

angular.module('prindleApp')
  .directive('detailsView', function () {
    return {
      templateUrl: 'components/detailsView/detailsView.html',
      restrict: 'E',
      controller: 'detailsViewCtrl',
      link: function (scope, element, attrs, ctrl) {

        scope.currentItem = null;

        var unregisterCategoriesLoaded = scope.$on('categories-loaded', function () {
          ctrl.getCategories();
          unregisterCategoriesLoaded();
        });


        scope.$on('items-selection-changed', function () {
          ctrl.updateDetailsView();
        });

      }
    };
  })
  .controller('detailsViewCtrl', ['$scope', '$position', 'guiState', 'appData', 'listUtil', 'Upload', 'Modal', 'categoryService',
    function ($scope, $position, guiState, appData, listUtil, Upload, Modal, categoryService) {

      var self = this;

      var lastItemSelected;

      this.updateDetailsView = function () {

        var selectedItem = _getSelectedItem();
        var qtyItemsSelected = guiState.state.items.selected.length;
        var selectingSingle = qtyItemsSelected === 1;

        if (!lastItemSelected && selectingSingle) {
          lastItemSelected = selectedItem;
          $scope.currentItem = selectedItem;
          _getImage($scope.currentItem);
        }

        if (selectingSingle) {
          if (lastItemSelected._id === selectedItem._id) {
            return;
          } else if (selectingSingle) {
            lastItemSelected = selectedItem;
            $scope.currentItem = selectedItem;
            _getImage($scope.currentItem);
          }
        }

      };


      this.getCategories = function () {
        $scope.categories = appData.data.categories;
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
            _getImage($scope.currentItem);
          });
      };


      var _getImage = function (currentItem) {
        listUtil.getImage(currentItem).then(function (data) {
          if (data._id) {
            $scope.currentItem.imageID = data._id;

            if (data.isClipArt) {
              $scope.currentImage = 'images/clipart' + data.name;
            } else {
              $scope.currentImage = 'images/' + data.name;
            }
          }
        }, function (err) {
          throw new Error(err);
        });
      };


      var _getSelectedItem = function () {
        if (guiState.state.items.selected.length === 1) {
          return guiState.state.items.selected[0];
        } else {
          return false;
        }
      };


      /**
       * View actions
       */


      $scope.updateCategory = function () {
        var currentItem = _getSelectedItem();
        if (currentItem) {
          listUtil.update('items', currentItem)
            .then(function () {

            }, function (err) {
              throw new Error(err);
            });
        }
      };


      $scope.selectCategory = function (name) {
        if ($scope.currentItem.category !== name) {
          $scope.currentItem.category = name;
          listUtil.update('items', $scope.currentItem)
            .then(function () {

            }, function (err) {
              throw new Error(err);
            });
        }
      };


      $scope.addNewCategory = function () {
        Modal.singleField(function (newCategory) {
          categoryService.add(newCategory)
            .then(function () {
              self.getCategories();
              $scope.selectCategory(newCategory);
            }, function (err) {
              throw new Error(err);
            });
        })('Add new category');
      };


      $scope.manageCategories = function () {
        Modal.category()('Manage Categories');
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

      /**
       * event listeners
       */

      $scope.$on('added-to-categories', function () {
        self.getCategories();
      });

      $scope.$on('deleted-from-categories', function () {
        self.getCategories();
      });


      $scope.$on('updated-categories', function () {
        self.getCategories();
      });

    }]);