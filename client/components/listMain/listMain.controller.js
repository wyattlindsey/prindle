'use strict';

/**
 * listMainCtrl is in charge of everything happening in the application overall
 */

angular.module('prindleApp')
  .controller('listMainCtrl', function ($scope, $http) {

      $scope.items = [];
      $scope.collections = [];

      $scope.getItems = function() {
        $http.get('/api/items').success(function(items) {
          $scope.items = items;
        }).
        error(function(err) {
          console.log(err);
        });
      };

      $scope.getCollections = function() {
        $http.get('/api/collections').success(function(collections) {
          $scope.collections = collections;
        }).
        error(function(err) {
          console.log(err);
        });
      };


      $scope.getItems();
      $scope.getCollections();
  });
