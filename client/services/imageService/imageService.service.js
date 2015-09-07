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

    /**
     *
     * imageService.deleteImage()
     *
     * @param image
     * @returns promise
     *
     * Completely removes an image from the database, then goes through every item in appData
     * that might have an imageID parameter and clears it out
     *
     */


    this.deleteImage = function(image) {
      var deferred = $q.defer();

      listUtil.delete('images', image)
        .then(function() {
          var lists = Object.keys(appData.data);

          // go through each collection in appData.data to remove associated image
          _.forEach(lists, function(listName) {
            var foundEntities = _.filter(appData.data[listName], {'imageID': image._id});
            _.forEach(foundEntities, function(entity) {
              entity.imageID = '';
              listUtil.update(listName, entity)
                .then(function() {

                }, function(err) {
                  deferred.reject(err);
                });
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

    /**
     *
     * imageService.removeImage()
     *
     * @param listName - name of list, such as 'items' or 'catalogs'
     * @param entity - thing that has an image associated with it
     * @returns promise
     *
     * disassociates an image with a particular thing like a catalog
     *
     */


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
