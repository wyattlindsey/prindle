'use strict';

angular.module('prindleApp')
  .service('catalogViewService', ['$rootScope', 'appData', 'listUtil', function($rootScope, appData, listUtil) {
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
                console.log(catalogs);
                $rootScope.$broadcast('refresh-catalogs', catalogs);
              });

          }

        });
    };



  }]);
