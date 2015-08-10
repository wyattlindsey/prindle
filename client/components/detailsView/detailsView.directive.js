'use strict';

angular.module('prindleApp')
  .directive('detailsView', function () {
    return {
      templateUrl: 'components/detailsView/detailsView.html',
      restrict: 'E',
      controller: 'detailsViewCtrl',
      link: function (scope, element, attrs, ctrl) {

        scope.currentItem = null;
        scope.images = [];

        var unregisterCategoriesLoaded = scope.$on('categories-loaded', function () {
          ctrl.getCategories();
          ctrl.refreshImages();
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
  .controller('detailsViewCtrl', ['$scope', '$position', 'guiState', 'appData', 'listUtil', 'Upload', 'Modal', 'categoryService',
    function ($scope, $position, guiState, appData, listUtil, Upload, Modal, categoryService) {

      var self = this;

      $scope.popover = {};
      $scope.popover.imageMenuTemplateUrl = 'components/detailsView/imageMenu.html';

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


      /**
       * This should be more modular, maybe an image service.  Shouldn't be GETing everything on updates.
       */

      this.refreshImages = function() {
        listUtil.get('images')
          .then(function(images) {
            if (images.length === 0) {
              return;
            } else {
              console.log('images: ' + JSON.stringify(images));
              $scope.images = appData.data.images = images; // really need to load this into appData?
            }
          }, function(err) {
            throw new Error(err);
          });
      };


      var _getImages = function() {

      };


      var _uploadImage = function (file) {
        var filePath = 'images/' + file.name;
        Upload.upload({
          url: '/api/images/',
          file: file,
          fields: {
            'isClipArt': false,
            'filePath': filePath
          }
        })
          .success(function (data) {
            listUtil.show('images', data._id)
              .then(function(image) {
                image.filePath = 'images/' + data.name;
                listUtil.update('images', image);   // need error catching here
              });

            appData.data.images.push(data);
            $scope.currentItem.imageID = data._id;
            listUtil.update('items', $scope.currentItem);   // need error catching here
            _getImage($scope.currentItem);
          });
      };


      var _getImage = function (currentItem) {
        listUtil.getImage(currentItem).then(function (image) {
          if (image._id) {
            $scope.currentItem.imageID = image._id;

            /**
             * why is the path being determine here instead of read from the object?
             */

            if (image.isClipArt) {
              $scope.currentImagePath = 'images/clipart' + image.name;
            } else {
              $scope.currentImagePath = 'images/' + image.name;
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