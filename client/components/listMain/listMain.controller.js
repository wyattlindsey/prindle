'use strict';

/**
 * listMainCtrl is in charge of everything happening in the application overall
 */

angular.module('prindleApp')
  .controller('listMainCtrl', function ($scope, $http, $q) {

      $scope.items = [];
      $scope.itemsForSelectedCollection = [];
      $scope.collections = [];



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
        }).
        error(function(err) {
          console.log(err);
        });
      };

      $scope.getItemsForCollection = function(collectionID) {
        console.log(collectionID);
        var collection = $.grep($scope.collections, function(e){ return e._id == collectionID });
        console.log(collection[0]);
        $scope.itemsForSelectedCollection = collection[0].items;
      };


      $scope.getItems();
      $scope.getCollections();
  });
