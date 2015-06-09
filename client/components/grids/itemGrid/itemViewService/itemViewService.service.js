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
      /**
       * Why is the item view not refreshing properly.
       */
      var displayItems = [];
      _.forEach(catalog.items, function(itemID) {
        var match = _.find(appData.data.items, function(item) {
          return item._id === itemID;
        });
        if (typeof match !== 'undefined') {
          displayItems.push(match);
        }
      });
      return displayItems;
    };

  }]);
