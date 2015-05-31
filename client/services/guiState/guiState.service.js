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

//    this.selected = function(collection, selectionsArray) {
//      return getSetProperty(collection, 'selected', selectionsArray);
//    };
//
//    this.selectionDeletable = function(collection, deletableBool) {
//      return getSetProperty(collection, 'selectionDeletable', deletableBool);
//    };
//
//    this.editInProgress = function(collection, editInProgressBool) {
//      return getSetProperty(collection, 'editInProgress', editInProgressBool);
//    };
//
//    this.multipleItemsSelected = function(collection, multipleItemsSelectedBool) {
//      return getSetProperty(collection, 'multipleItemsSelected', multipleItemsSelectedBool);
//    };
//
//    var getSetProperty = function(collection, collectionProperty, newValue) {
//      if (typeof _state[collection] !== 'undefined') { // make sure collection exists
//        if (typeof newValue !== 'undefined') {  // respond to request as setting
//          if (typeof _state[collection][collectionProperty] !== 'undefined') {  // make sure property exists
//            _state[collection][collectionProperty] = newValue;  // set it and respond with success
//            return true;
//          } else {
//            return false;
//          }
//        } else {
//          return _state[collection][collectionProperty];  // respond to request as getter
//        }
//      } else {
//        return false;
//      }
//    };

    Object.seal(this);
  });
