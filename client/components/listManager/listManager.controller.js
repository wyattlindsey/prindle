'use strict';

/**
 * listManagerCtrl is in charge of everything happening in the application overall, coordinating
 * the catalog and items lists as well as the details view
 */

angular.module('prindleApp')
  .controller('listManagerCtrl', function ($scope, $http, $q, crud, listUtil) {


      $scope.catalogs = {};
      $scope.items = {};
      $scope.data = {};
      $scope.data.catalogs = [];
      $scope.data.items = [];
      $scope.crud = crud;
      $scope.listUtil = listUtil;

      crud.get($scope.data, 'catalogs');

      crud.get($scope.data, 'items');


  });
