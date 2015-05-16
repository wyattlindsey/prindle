'use strict';

/**
 * listManagerCtrl is in charge of everything happening in the application overall, coordinating
 * the catalog and items lists as well as the details view
 */

angular.module('prindleApp')
  .controller('listManagerCtrl', function ($scope, $http, $q, crud, listUtil) {

    $scope.data = {
      catalogs : {
        list : []
      }
    };


    $scope.crud = crud;
    $scope.listUtil = listUtil;
    crud.get('catalogs')
      .then(function(data) {
        $scope.data.catalogs.list = data;
      });

//    crud.get($scope, 'items');


  });
