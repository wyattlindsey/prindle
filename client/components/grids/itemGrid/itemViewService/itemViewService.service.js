'use strict';

angular.module('prindleApp')
  .service('itemViewService', ['appData', 'guiState', 'listUtil', function(appData, guiState, listUtil) {

    this.refresh = function() {
      return _refresh();
    };


    this.loadData = function(items) {
      _loadData(items);
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

    var _refresh = function() {

      if (guiState.state.catalogs.selected.length === 1) {
        return _getItemsForCatalog(guiState.state.catalogs.selected[0]);
      } else {
        return [];
      }
    };


    var _loadData = function(items) {
      appData.data.items = items;
      _.forEach(appData.data.items, function(item) {
        item.catalogs.push(appData.data.catalogs[0]._id);
      });
    };


    var _getItemsForCatalog = function(catalog) {
      var itemsInCatalog = _.filter(appData.data.items, function(item) {
        var catalogMatches = _.filter(item.catalogs, function(catalogID) {
          return catalog._id === catalogID;
        });
        return catalogMatches.length > 0;
      });
      console.log(itemsInCatalog);
      return itemsInCatalog;
    };


    var _addItemsToCatalog = function(sourceItems, destCatalog) {
      var itemsToUpdate = [];

      _.forEach(sourceItems, function(item) {
        var foundInCatalogs = _.filter(item.catalogs, function(catalog) {
          return catalog === destCatalog._id;
        });

        if (foundInCatalogs.length === 0) {
          item.catalogs.push(destCatalog._id);
          itemsToUpdate.push(item);
        }
      });

      listUtil.update('items', itemsToUpdate);
    };


  }]);
