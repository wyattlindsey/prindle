'use strict';

angular.module('prindleApp')
  .directive('detailsView', function () {
    return {
      templateUrl: 'components/detailsView/detailsView.html',
      restrict: 'E',
      controller: 'detailsViewCtrl',
      link: function (scope, element, attrs, ctrl) {

        scope.currentItem = null;
        scope.currentItemImagePath = '';
        scope.images = [];
        scope.imageMenuOpen = false;

        var unregisterCategoriesLoaded = scope.$on('categories-loaded', function () {
          ctrl.updateCategoriesMenu();
          ctrl.loadImages();
          unregisterCategoriesLoaded();
        });


        scope.$on('items-selection-changed', function () {
          ctrl.updateDetailsView();
        });


        scope.$on('added-to-images', function() {
          ctrl.refreshImages();
        });

      }
    };
  })
  .controller('detailsViewCtrl', ['$scope', 'guiState', 'imageService', 'listUtil', 'Modal', 'categoryService',
    function ($scope, guiState, imageService, listUtil, Modal, categoryService) {

      var self = this;

      $scope.popover = {};
      $scope.popover.imageMenuTemplateUrl = 'components/detailsView/imageMenu.html';

      var lastItemSelected;

      this.updateDetailsView = function () {

        // this function prevents the details view from going blank when something is deselected
        // it shows details for the last item selected

        var selectedItem = _getSelectedItem();
        var qtyItemsSelected = guiState.state.items.selected.length;
        var selectingSingle = qtyItemsSelected === 1;

        if (!lastItemSelected && selectingSingle) {
          lastItemSelected = selectedItem;
          $scope.currentItem = selectedItem;
          $scope.currentItemImagePath =_getImagePath($scope.currentItem);
        }

        if (selectingSingle) {
          if (lastItemSelected._id === selectedItem._id) {
            return;
          } else if (selectingSingle) {
            lastItemSelected = selectedItem;
            $scope.currentItem = selectedItem;
            $scope.currentItemImagePath = _getImagePath($scope.currentItem);
          }
        }

      };


      this.clearDetailsView = function() {
        $scope.currentItem = null;
      };


      var _getSelectedItem = function () {
        if (guiState.state.items.selected.length === 1) {
          return guiState.state.items.selected[0];
        } else {
          return false;
        }
      };


      /**
       * Image handling
       */


      $scope.onImageFileSelect = function ($files) {
        if ($files && $files.length) {
          imageService.uploadImage($files[0])
            .then(function(image) {
              imageService.setItemImage($scope.currentItem, image)
                .then(function() {
                  self.updateDetailsView();
                }, function(err) {
                  throw new Error(err);
                });
            });
        }
      };


      $scope.imageFileDropped = function ($files, $event, $rejectedFiles) {
        if ($rejectedFiles.length === 0 && $files && $files.length) {
          imageService.uploadImage($files[0])
            .then(function(image) {
              imageService.setItemImage($scope.currentItem, image)
                .then(function() {
                  self.updateDetailsView();
                }, function(err) {
                  throw new Error(err);
                });
            }, function(err) {
              throw new Error(err);
            });
        }
      };


      $scope.selectItemImage = function(image) {
        imageService.setItemImage($scope.currentItem, image)
          .then(function() {
            self.closeImageMenu();
          }, function(err) {
            throw new Error(err);
          });
      };


      $scope.removeItemImage = function(item) {
        if (!item) {
          return;
        } else {
          imageService.removeItemImage(item)
            .then(function() {

            });
        }
      };


      $scope.deleteImage = function(image, event) {
        imageService.deleteImage(image)
          .then(function() {
            self.openImageMenu();   // not the greatest, but stopPropagation is bombing out so have to
                                    // reopen the popover since the blur event is fired, closing the
                                    // popover
          }, function(err) {
            throw new Error(err);
          });
      };


      var _getImagePath = function (currentItem) {
        if (currentItem.imageID) {
          var image = imageService.getItemImage(currentItem);
          if (image) {
            return image.filePath;
          } else {
            return false;
          }
        } else {
          return false;
        }
      };


      this.loadImages = function() {
        imageService.loadImages()
          .then(function(images) {
            $scope.images = images;
          }, function(err) {
            throw new Error(err);
          });
      };


      this.refreshImages = function() {
        $scope.images = imageService.get();
      };


      $scope.$on('added-to-images', function() {
        self.refreshImages();
      });


      $scope.$on('deleted-from-images', function() {
        self.refreshImages();
      });


      $scope.$on('updated-images', function() {
        self.refreshImages();
      });


      this.closeImageMenu = function() {
        $scope.imageMenuOpen = false;
      };

      this.openImageMenu = function() {
        $scope.imageMenuOpen = true;
      };


      /**
       * Categories
       */



      /**
       *
       * @param name
       *
       * Assigns a category to an item
       */

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


      /**
       * choice in category menu
       */

      $scope.manageCategories = function () {
        Modal.category()('Manage Categories');
      };


      this.updateCategoriesMenu = function () {
        $scope.categories = categoryService.get();
      };


      /**
       * event listeners
       */

      $scope.$on('added-to-categories', function () {
        self.updateCategoriesMenu();
      });

      $scope.$on('deleted-from-categories', function () {
        self.updateCategoriesMenu();
      });

      $scope.$on('updated-categories', function () {
        self.updateCategoriesMenu();
      });

      $scope.$on('deleted-from-items', function () {
        self.clearDetailsView();
      });

    }]);