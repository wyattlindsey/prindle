'use strict';

angular.module('prindleApp')
  .service('catalogViewService', ['$rootScope', 'appData', 'listUtil', 'guiState',
      function($rootScope, appData, listUtil, guiState) {
    this.refresh = function(catalogs) {
      if (typeof catalogs !== 'undefined') {
        return appData.data.catalogs = catalogs;
      } else {
        return false;
      }
    };

    this.loadData = function() {

      listUtil.get('catalogs')
        .then(function(catalogs) {
          if (catalogs.length === 0) {
            var allItemIDs = _.pluck(appData.data.items, '_id');
            listUtil.add('catalogs', [
              {
                name: 'Master List',
                readOnly: true,
                isMaster: true,
                items: allItemIDs // master list contains IDs of all items
              }
            ]);
          } else {
            listUtil.get('catalogs')
              .then(function(catalogs) {
                $rootScope.$broadcast('refresh-catalogs', catalogs);
              });

          }

        });
    };

    this.dropItems = function(data) {
      var sourceItems = [];
      if (guiState.state.items.selected.length > 0) {
        sourceItems = guiState.state.items.selected;
      }
      sourceItems.push(angular.element(data.src).scope().$parent.row.entity);
      var destEntity = angular.element(data.dest).scope().$parent.row.entity;
      _addItemsToCatalog(sourceItems, destEntity);
    };

    var _addItemsToCatalog = function(sourceItems, destCatalog) {

      if (typeof destCatalog.items !== 'undefined') {

        var originalItems = destCatalog.items;

        if (destCatalog.items.length > 0) {
          var newIDs = _.pluck(sourceItems, '_id');
          destCatalog.items = destCatalog.items.concat(newIDs);
        } else {
          destCatalog.items = _.pluck(sourceItems, '_id');
        }
        if (_.difference(destCatalog.items, originalItems).length > 0) {
          destCatalog.items = _.uniq(destCatalog.items);

          listUtil.update('catalogs', [destCatalog]);
        }

      }

    };

  }]);
