'use strict';

/**
 * listMainCtrl is in charge of everything happening in the application overall
 */

angular.module('prindleApp')
  .controller('listMainCtrl', function ($scope, $http, $q, crud) {


      $scope.itemsForSelectedCollection = [];
      $scope.selectedCollection = {};
      $scope.data = {};
      $scope.data.collections = [];
      $scope.data.items = [];
      $scope.crud = crud;

      crud.get($scope.data, 'collections');

      crud.get($scope.data, 'items');


  });
