'use strict';

angular.module('prindleApp')
  .service('appData', function () {
    this.data = {
      catalogs: [],
      items: [],
      categories: [],
      images: []    // not sure if this is necessary
    };
    Object.seal(this);
  });
