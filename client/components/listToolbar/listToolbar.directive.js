'use strict';

angular.module('prindleApp')
  .directive('listToolbar', ['guiState', function (guiState) {
    return {
      restrict: 'E',
      scope: {
        listName: '='
      },
      controller: 'listToolbarCtrl',
      link: function (scope, element, attrs) {
        scope.initToolbar(attrs);
      }
    };
  }])
  .controller('listToolbarCtrl', ['$scope', 'Modal', 'listUtil', 'guiState', 'appData',
      function($scope, Modal, listUtil, guiState, appData) {

    $scope.initToolbar = function(attrs) {
      $scope.listName = attrs.listName;
    };

    this.add = function() {
      if ($scope.listName === 'catalogs') {
        listUtil.add($scope.listName,
          [{
            name: 'untitled',
            readOnly: false,
            isMaster: false,
            items: []
          }]
        );
      } else if ($scope.listName === 'items') {

        listUtil.add($scope.listName,
          {
            name: 'my new thing',
            weight: Math.round(Math.random() * 100),
            readOnly: false,
            imageID: ''
          }
        );

      }

    };


    this.copy = function() {
      if (typeof appData.data[$scope.listName]  === 'undefined' || appData.data[$scope.listName].length === 0 ||
        guiState.state[$scope.listName].selected.length === 0) {
        return;
      } else {
        listUtil.copy($scope.listName, guiState.state[$scope.listName].selected);
      }
    };

    this.delete = function() {

      var names = '';
      var qtyNames = guiState.state[$scope.listName].selected.length;

      _.forEach(guiState.state[$scope.listName].selected, function(selectedMember, i) {

        if (i !== 0 && i < (qtyNames - 1)) {
          names += ', ';
        }
        if (i === (qtyNames - 1) && qtyNames > 1) {
          names += ' and ';
        }

        names += selectedMember.name;
      });

      var openDeleteModel = Modal.confirm.delete(function() {
        if (typeof appData.data[$scope.listName] === 'undefined' || appData.data[$scope.listName].length === 0 ||
          guiState.state[$scope.listName].selected.length === 0) {
          return;
        } else {
          listUtil.delete($scope.listName, guiState.state[$scope.listName].selected);
        }
      });

      openDeleteModel(names);
    };


    this.selectionDeletable = function() {
      var readOnlyItems = _.filter(guiState.state[$scope.listName].selected, function(selectedItem) {
        return selectedItem.readOnly;
      });
      if (guiState.state[$scope.listName].selected.length > 0 && readOnlyItems.length === 0) {
        return true;
      } else {
        return false;
      }
    };


    this.nothingSelected = function() {
      if (guiState.state[$scope.listName].selected.length > 0) {
        return false;
      } else {
        return true;
      }
    };


    this.noCatalogSelected = function() {
      if (guiState.state.catalogs.selected.length > 0) {
        return false;
      } else {
        return true;
      }
    };
  }]);