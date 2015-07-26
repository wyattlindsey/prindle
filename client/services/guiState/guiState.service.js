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
        multipleItemsSelected: false,
        displayItems: []     // items to show in itemView grid at any given time
      },
      categories: {
        selected: [],
        selectionDeletable: false,
        editInProgress: false,
        multipleItemsSelected: false
      }
    };

    Object.seal(this);
  });
