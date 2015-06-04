'use strict';

angular.module('prindleApp')
  .service('itemViewService', ['appData', 'guiState', function(appData, guiState) {

    this.refresh = function() {
      return _refresh();
    };

    this.loadData = function(items) {
      _loadData(items);
    };

    var _refresh = function() {

      if (guiState.state.catalogs.selected.length === 1) {
        console.log(appData.data.items);
        return appData.data.items;
      } else {
        return [];
      }
    };

    var _loadData = function(items) {
      appData.data.items = items;
    };

  }]);
