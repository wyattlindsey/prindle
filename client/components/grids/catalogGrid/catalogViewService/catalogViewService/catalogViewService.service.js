'use strict';

angular.module('prindleApp')
  .service('catalogViewService', ['appData', 'listUtil', function(appData, listUtil) {
    this.refresh = function(catalogs) {
      if (typeof catalogs !== 'undefined') {
        return appData.data.catalogs = catalogs;
      }
    };

    this.loadData = function() {

      listUtil.get('catalogs')
        .then(function(catalogs) {
          if (catalogs.length === 0) {
            listUtil.add('catalogs', [
              {
                name: 'Master List',
                readOnly: true,
                isMaster: true
              }
            ]);
          }
          return appData.data.catalogs = catalogs;

          /**
           * async problem maybe?
           */
        });
    };

  }]);
