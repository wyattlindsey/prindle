'use strict';

angular.module('prindleApp')
  .service('imageService', ['$q', 'appData', 'listUtil', 'Upload', function ($q, appData, listUtil, Upload) {

    var self = this;

    this.addImage = function() {

    };


    this.get = function() {
      if (appData.data.images) {
        return appData.data.images;
      } else {
        return false;
      }
    };


    this.loadImages = function() {
      var deferred = $q.defer();

      listUtil.get('images')
        .then(function(images) {
          deferred.resolve(images);
        }, function(err) {
          deferred.reject(err);
        });

      return deferred.promise;
    };


    this.uploadImage = function(file) {
      var deferred = $q.defer();

      Upload.upload({
        url: '/api/images/',
        file: file,
        fields: {
          'isClipArt': false,
          'filePath': {}
        }
      })
        .success(function (data) {
          listUtil.show('images', data._id)
            .then(function(image) {
              image.filePath = 'images/' + image.name;
              listUtil.update('images', image)
                .then(function(image) {
                  appData.data.images.push(image);
                  deferred.resolve(image);
                }, function(err) {
                  deferred.reject(err);
                });
            }, function(err) {
              deferred.reject(err);
            });
        })
        .error(function(err) {
          deferred.reject(err);
        });

      return deferred.promise;
    };


    this.deleteImage = function() {

    };


    this.updateImage = function() {

    };


    this.getItemImage = function(item) {
      return _.find(appData.data.images, {'_id': item.imageID});
    };


    this.setItemImage = function(item, image) {
      console.log('image: ' + image._id);
      item.imageID = image._id;
      item.imagePath = image.filePath;
      listUtil.update('items', item)
        .then(function() {

        }, function(err) {
          throw new Error(err);
        });
    };


    this.removeItemImage = function() {

    };



  }]);
