'use strict';

angular.module('prindleApp')
  .service('catalogViewService', ['$rootScope', 'appData', 'listUtil', 'guiState',
  function($rootScope, appData, listUtil, guiState) {

    this.refresh = function() {
      return appData.data.catalogs;
    };


    this.clearSelection = function() {
      guiState.state.catalogs.selected = [];
      $rootScope.$broadcast('catalogs-selection-cleared');
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



    this.addItemsToCatalog = function(newItems) {



      var masterCatalogSelected = (guiState.state.catalogs.selected.length === 1 &&
        guiState.state.catalogs.selected[0]._id === appData.data.catalogs[0]._id);

      // first add to master catalog
      _addItemsToCatalog(newItems, appData.data.catalogs[0]);

      if (guiState.state.catalogs.selected.length === 1 && !masterCatalogSelected) {
        var destCatalog = guiState.state.catalogs.selected[0];
        _addItemsToCatalog(newItems, destCatalog);
      }

    };



    this.deleteItemsFromCatalogs = function(deletedItems, catalogs) {
      if (typeof catalogs !== 'undefined') {
        _deleteItemsFromCatalogs(deletedItems, catalogs);
      } else {
        _deleteItemsFromCatalogs(deletedItems);
      }
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


          listUtil.update('catalogs', [destCatalog])
            .then(function() {
              $rootScope.$broadcast('refresh-items');
            });
        } else {
          destCatalog.items = originalItems;
        }

      }

    };


    var _deleteItemsFromCatalogs = function(deletedItems, catalogs) {

      var catalogsToDeleteItemsFrom = [];
      var masterCatalogSelected = (guiState.state.catalogs.selected.length === 1 &&
        guiState.state.catalogs.selected[0]._id === appData.data.catalogs[0]._id);

      // no catalogs argument passed or Master List selected -> delete from all catalogs
      if (typeof catalogs === 'undefined' || masterCatalogSelected) {
        catalogsToDeleteItemsFrom = appData.data.catalogs;
      } else {
        catalogsToDeleteItemsFrom = catalogs;
      }

      _.forEach(deletedItems, function(item) {
        _.forEach(catalogsToDeleteItemsFrom, function(catalog) {
          _.forEach(catalog.items, function(id) {
            if (item._id === id) {
              catalog.items.splice(catalog.items.indexOf(id), 1);
            }
          });
        });
      });

    };

  }]);
