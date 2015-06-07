'use strict';

angular.module('prindleApp')
  .service('itemViewService', ['appData', 'guiState', 'listUtil', function(appData, guiState, listUtil) {

    this.refresh = function() {
      return _refresh();
    };


    this.loadData = function(items) {
      appData.data.items = items;
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

  }]);
