'use strict';

angular.module('prindleApp')
  .service('itemViewService', ['$rootScope', 'appData', 'guiState', 'listUtil', 'categoryService',
    function ($rootScope, appData, guiState, listUtil, categoryService) {

      // create self variable to stop this madness

      this.refresh = function () {
        return _refresh();
      };


      this.loadData = function (items) {
        listUtil.get('items')
          .then(function (items) {
            appData.data.items = items;
            $rootScope.$broadcast('items-loaded');
          }, function(err) {
            throw new Error(err);
          });
      };


      this.clearSelection = function () {
        guiState.state.items.selected = [];
        $rootScope.$broadcast('clear-selected-items');
      };


      this.masterListSelected = function () {
        if (guiState.state.catalogs.selected.length > 0) {
//        console.log(guiState.state.catalogs.selected[0].name === "Master List");
          return guiState.state.catalogs.selected[0].name === "Master List"; // NEED TO CHANGE THIS
        } else {
          return false;
        }

      };


      this.updateItems = function(items) {
        listUtil.update('items', items)
          .then(function(){
          }, function(err) {
            throw new Error(err);
          });

      };


      this.getCategories = function() {
        return appData.data.categories;
      };


      var _refresh = function () {

        if (guiState.state.catalogs.selected.length === 1) {
          return _getItemsForCatalog(guiState.state.catalogs.selected[0]);
        } else {
          return [];
        }
      };


      var _getItemsForCatalog = function (catalog) {
        /**
         * Why is the item view not refreshing properly.
         */
        var displayItems = [];
        _.forEach(catalog.items, function (itemID) {
          var match = _.find(appData.data.items, function (item) {
            return item._id === itemID;
          });
          if (typeof match !== 'undefined') {
            displayItems.push(match);
          }
        });
        return displayItems;
      };

    }]);
