'use strict';

angular.module('prindleApp')
  .service('appData', function () {
    this.data = {
      catalogs: [],
      items: []
    };
    Object.seal(this);
  });
