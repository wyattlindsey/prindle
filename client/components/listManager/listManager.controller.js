'use strict';

/**
 * listManagerCtrl is in charge of everything happening in the application overall, coordinating
 * the catalog and items lists as well as the details view
 */

angular.module('prindleApp')
  .controller('listManagerCtrl', function ($scope, $http, $q, crud, gridService, listUtil, guiState) {

    // set up data structures for catalogs, all items, and displayed items

    $scope.data = {
      catalogs: [],
      items: [],
      displayItems: []  // stores the list that should be displayed in the $scope.itemView grid
    };

    // initialize list state

//    var guiState = guiState;
    var myGuiState = guiState;
    console.log(myGuiState.selected('catalogs'));

    $scope.state = {
      catalogs: {
        selected: [],
        selectionDeletable: false,
        editInProgress: false,
        multipleItemsSelected: false
      },
      items: {
        selected: [],
        selectionDeletable: false,
        editInProgress: false,
        multipleItemsSelected: false
      }
    };

    // instantiate services

    $scope.crud = crud;
    $scope.listUtil = listUtil;
    $scope.gridService = gridService;

    // initialize views

    $scope.crud.get('catalogs')
      .then(function(data) {
        $scope.data.catalogs = data;
      });

    $scope.crud.get('items')
      .then(function(data) {
        $scope.$broadcast('startup-items-loaded', data);
      });

  });
