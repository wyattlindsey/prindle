'use strict';

angular.module('prindleApp')
  .service('imageService', ['$q', 'appData', 'listUtil', 'Upload', function ($q, appData, listUtil, Upload) {

    var self = this;


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


    this.deleteImage = function(image) {
      var deferred = $q.defer();

      listUtil.delete('images', image)
        .then(function() {
          var foundItems = _.filter(appData.data.items, {'imageID': image._id});
          _.forEach(foundItems, function(item) {
            item.imageID = '';
            listUtil.update('items', item)
              .then(function() {

              }, function(err) {
                deferred.reject(err);
              });
          });
          deferred.resolve();
        }, function(err) {
          deferred.reject(err);
        });

      return deferred.promise;
    };


    this.getImage = function(entity) {
      return _.find(appData.data.images, {'_id': entity.imageID});
    };


    this.setImage = function(listName, entity, image) {
      var deferred = $q.defer();

      if (!listName || !entity || !image) {
        deferred.reject('incorrect arguments to setImage'); // should this go everywhere?
      }                                                     // maybe just where http requests
                                                            // are going to be made?

      //check for duplicates
      if (entity.imageID === image._id) {
        deferred.resolve();
      } else {
        entity.imageID = image._id;
        entity.imagePath = image.filePath;
        listUtil.update(listName, entity)
          .then(function() {
            deferred.resolve();
          }, function(err) {
            deferred.reject(err);
          });
      }

      return deferred.promise;
    };


    this.removeImage = function(listName, entity) {
      var deferred = $q.defer();

      entity.imageID = '';
      listUtil.update(listName, entity)
        .then(function() {
          deferred.resolve();
        }, function(err) {
          deferred.reject(err);
        });

      return deferred.promise;
    };



  }]);
