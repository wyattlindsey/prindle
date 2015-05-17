'use strict';

/**
 * Abstraction for talking to the database and handling async with promises.  localData points
 * to $scope.data in the main controller.  endpoint is a string that specifies which API
 * entity (list, item) we're dealing with
 */

angular.module('prindleApp')
  .service('crud', function ($http, $q) {

      /**
       *
       * get() - pull all records from API endpoint
       *
       * @param localData
       * @param endpoint
       * @returns {*}
       */

      // to-do: add optional functionality for getting just one item
    this.get = function(endpoint) {
      var deferred = $q.defer();

      $http.get('/api/' + endpoint).success(function(data) {
        deferred.resolve(data);
      }).
          error(function(err) {
            console.log(err);
            deferred.reject();
          });

      return deferred.promise;
    };

      /**
       *
       * add() - creates new single record
       *
       * @param localData
       * @param endpoint
       * @param newItemData
       * @returns {*}
       */

    this.add = function(endpoint, newItemData) {
      var deferred = $q.defer();

      if (newItemData === '') {
          deferred.reject('no data');
      } else {
        $http.post(('/api/' + endpoint), JSON.stringify(newItemData))
        .success(function(data) {
          deferred.resolve(data);
        }).error(function(err) {
          deferred.reject(err);
        });
      }
        return deferred.promise;
    };

      /**
       *
       * update() - modify one record
       *
       * @param localData
       * @param endpoint
       * @param id
       * @param updatedItemData
       * @returns {*}
       */

    this.update = function(endpoint, id, updatedItemData) {

      var deferred = $q.defer();
      if (updatedItemData === '' || id === '') {
        deferred.reject('Invalid data');
      } else {
        $http.put('/api/' + endpoint + '/' + id, JSON.stringify(updatedItemData))
          .success(function (data) {
            deferred.resolve(data);
          }).error(function (data) {
            deferred.reject('Update failed: ' + data);
          });
      }
      return deferred.promise;
    };

      /**
       *
       * delete() - remove one record
       *
       * @param localData
       * @param endpoint
       * @param id
       * @returns {*}
       */

    this.remove = function(endpoint, id) {
      var deferred = $q.defer();
      if (id === '') {
        deferred.reject('no ID provided');
      } else {
        $http.delete('/api/' + endpoint + '/' + id).success(function(data) {
          deferred.resolve();
        }).
        error(function(err) {
          console.log(err);
        });
      }
      return deferred.promise;
    };

  });
