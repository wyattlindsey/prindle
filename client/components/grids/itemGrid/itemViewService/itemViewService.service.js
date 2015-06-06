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
      _addItemsToCatalog(sourceItems, destEntity);
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


    var _addItemsToCatalog = function(sourceItems, destCatalog) {

      var nonDuplicatedItems = [];

      if (destCatalog.items.length > 0) {
        nonDuplicatedItems = _.filter(destCatalog.items, function(item) {
          var isFound = _.find(sourceItems, {'_id': item});
          console.log(isFound);
          return typeof isFound === 'undefined';
        });
      } else {
        nonDuplicatedItems = sourceItems;
      }

//      console.log(_.pluck(nonDuplicatedItems, '_id'));

      destCatalog.items = _.pluck(nonDuplicatedItems, '_id');

      listUtil.update('catalogs', [destCatalog]);
    };


  }]);
