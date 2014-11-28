'use strict';

/**
 * listMainCtrl is in charge of everything happening in the application overall
 */

angular.module('prindleApp')
  .controller('listMainCtrl', function ($scope, $http, $q) {

      $scope.items = [];
      $scope.itemsForSelectedCollection = [];
      $scope.collections = [];
      $scope.selectedCollection = {};



      $scope.getItems = function() {

        var deferred = $q.defer();

        $http.get('/api/items').success(function(items) {
          $scope.items = items;
          deferred.resolve();
        }).
        error(function(err) {
          console.log(err);
          deferred.reject();
        });

        return deferred.promise;
      };

      $scope.getCollections = function() {
        $http.get('/api/collections').success(function(collections) {
          $scope.collections = collections;
          console.log(collections[0].items);
        }).
        error(function(err) {
          console.log(err);
        });
      };

      $scope.getItemsForCollection = function(collection) {
        console.log(collection.items);
        $scope.items = collection.items;
      };






      $scope.addItem = function(data) {
        var deferred = $q.defer();

        if (data === '') {
          deferred.reject('no data');
        } else {
          $http.post('/api/items', JSON.stringify(data)).success(function(data) {
            deferred.resolve(data);
          }).error(function(err) {
            deferred.reject(err);
          });
        }
        return deferred.promise;
      };


      $scope.updateItem = function(id, data) {
        var deferred = $q.defer();

        if (data === '' || id === '') {
          deferred.reject('Invalid data');
        } else {
          $http.put('/api/items/' + id, JSON.stringify(data)).success(function () {
            deferred.resolve();
          }).
              error(function (data) {
                deferred.reject('Update failed: ' + data);
              });
        }
        return deferred.promise;
      };


      $scope.deleteItem = function(id) {
        var deferred = $q.defer();

        if (id === '') {
          deferred.reject('no ID provided')
        } else {
          $http.delete('/api/items/' + id).success(function(data) {
            deferred.resolve();
          }).
              error(function(err) {
                console.log(err);
              });
        }
        return deferred.promise;
      };

      $scope.generateTestData = function() {
//        $scope.addItem({
//          name: 'Hiya',
//          weight: '420',
//          category: 'Donut'
//        });
      };

      $scope.getItems();
      $scope.getCollections();
      $scope.generateTestData();
  });
