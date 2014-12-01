'use strict';

/**
 * Abstraction for talking to the database and handling async with promises
 */

angular.module('prindleApp')
  .service('crud', function ($http, $q) {


      // to-do: add optional functionality for getting just one item
    this.get = function(localData, endpoint) {
      var deferred = $q.defer();

      $http.get('/api/' + endpoint).success(function(data) {
        localData[endpoint] = data;
        deferred.resolve(localData);
      }).
          error(function(err) {
            console.log(err);
            deferred.reject();
          });

      return deferred.promise;
    };

    this.add = function(localData, endpoint, newItemData) {
      var deferred = $q.defer();

      if (newItemData === '') {
          deferred.reject('no data');
        } else {
          $http.post(('/api/' + endpoint), JSON.stringify(newItemData)).success(function(data) {
            localData[endpoint].push(data);
            deferred.resolve(data);
          }).error(function(err) {
            deferred.reject(err);
          });
        }
        return deferred.promise;
    };

    this.update = function(localData, endpoint, id, updatedItemData) {
      var deferred = $q.defer();

      if (data === '' || id === '') {
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

    this.remove = function(localData, endpoint, id) {
      var deferred = $q.defer();
      if (id === '') {
        deferred.reject('no ID provided')
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
