'use strict';

/**
 * listMainCtrl is in charge of everything happening in the application overall
 */

angular.module('prindleApp')
  .controller('listMainCtrl', function ($scope, $http, $q, crud) {

      $scope.items = [];
      $scope.itemsForSelectedCollection = [];
      $scope.collections = [];
      $scope.selectedCollection = {};
      $scope.data = {};
      $scope.data.collections = [];
      $scope.data.items = [];


      crud.get($scope.data, 'collections').then(function() {
      });

      crud.get($scope.data, 'items').then(function() {
        console.log($scope.data.items);
      });



//      $scope.addCollection = function(data) {
//        var deferred = $q.defer();
//
//        if (data === '') {
//          deferred.reject('no data');
//        } else {
//          $http.post('/api/collections', JSON.stringify(data)).success(function(data) {
//            $scope.collections.push(data);
//            deferred.resolve(data);
//          }).error(function(err) {
//            deferred.reject(err);
//          });
//        }
//        return deferred.promise;
//      };
//
//
//
//      $scope.addItem = function(data) {
//        var deferred = $q.defer();
//
//        if (data === '') {
//          deferred.reject('no data');
//        } else {
//          $http.post('/api/items', JSON.stringify(data)).success(function(data) {
//            $scope.items.push(data);
//            deferred.resolve(data);
//          }).error(function(err) {
//            deferred.reject(err);
//          });
//        }
//        return deferred.promise;
//      };

      $scope.addItemToCollection = function(item, collection) {
        collection.items.push(item);
//        $scope.updateCollection(collection._id, collection)
//            .then(function() {
//              $scope.getCollections();
//              console.log($scope.collections);
//            });
      };

      $scope.updateCollection = function(id, data) {
        var deferred = $q.defer();

        if (data === '' || id === '') {
          deferred.reject('Invalid data');
        } else {
          $http.put('/api/collections/' + id, JSON.stringify(data)).success(function (data) {
            $scope.collections = data;
            deferred.resolve();
          }).
              error(function (data) {
                deferred.reject('Update failed: ' + data);
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
//          name: 'This thing',
//          weight: 'That weight though',
//          category: 'Food'
//        }).then(function(data) {
//          $scope.collections[0].items.push(data._id);
//        });

//        $scope.addCollection({
//          name: 'My Heavyweight List',
//          items: []
//        }).then(function(data) {
//          var thisCollection = data;
//
//          $scope.addItem({
//            name: 'Expedition Pack',
//            weight: '5lb 5oz',
//            category: 'Big three'
//          }).then(function(data) {
//            var thisItem = data;
//            console.log(thisItem._id);
//            $scope.addItemToCollection(thisItem, thisCollection);
//          });
//        });


//        $scope.addItem({
//          name: 'Hiya',
//          weight: '420',
//          category: 'Donut'
//        });
      };

//      $scope.getItems();
//      $scope.getCollections().then(function() {
        $scope.generateTestData();
//      });

  });
