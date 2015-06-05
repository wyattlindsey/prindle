'use strict';

angular.module('prindleApp')
  .service('itemViewService', ['appData', 'guiState', 'listUtil', function(appData, guiState, listUtil) {

    this.refresh = function() {
      return _refresh();
    };


    this.loadData = function(items) {
      appData.data.items = items;
    };


    this.dropItems = function(data) {
      var sourceItems = [];
      if (guiState.state.items.selected.length > 0) {
        sourceItems = guiState.state.items.selected;
      }
      sourceItems.push(angular.element(data.src).scope().$parent.row.entity);
      var destEntity = angular.element(data.dest).scope().$parent.row.entity;
    };

    var _refresh = function() {

      if (guiState.state.catalogs.selected.length === 1) {
        return _getItemsForCatalog(guiState.state.catalogs.selected[0]);
      } else {
        return [];
      }
    };



    var _getItemsForCatalog = function(catalog) {
      var displayItems = [];
      _.forEach(catalog.items, function(itemID) {
        displayItems.push(_.find(appData.data.items, function(item) {
          return item._id === itemID;
        }));
      });
      return displayItems;
    };


//    var _addItemsToCatalog = function(sourceItems, destCatalog) {
//      var itemsToUpdate = [];
//
//      _.forEach(sourceItems, function(item) {
//        var foundInCatalogs = _.filter(item.catalogs, function(catalog) {
//          return catalog === destCatalog._id;
//        });
//
//        if (foundInCatalogs.length === 0) {
//          item.catalogs.push(destCatalog._id);
//          itemsToUpdate.push(item);
//        }
//      });
//
//      listUtil.update('items', itemsToUpdate);
//    };


  }]);
