'use strict';

angular.module('prindleApp')
  .service('guiState', function () {
    this.state = {
      catalogs: {
        selected: [],
        selectionDeletable: false,
        editInProgress: false,
        multipleItemsSelected: false
      },
      items: {
        selected: [],
        selectionDeletable: false,
        editInProgress: false,
        multipleItemsSelected: false
      }
    };

    Object.seal(this);
  });
