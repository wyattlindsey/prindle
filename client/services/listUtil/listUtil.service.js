'use strict';

/**
 * This service is an effort to pull common functionality out of the item and catalog lists
 */

angular.module('prindleApp')
  .service('listUtil', function () {
      /**
       * The below is jQuery to deal with the shift and delete keys.
       * To do: use ui-grid as much as possible for this and move out into a controller-
       * independent service. << that's in progress now
       */

      this.registerKeyEvents = function(list) {
        // keydown/keyup to enable/disable multi-select
        $('body').keydown(function (e) {
          if ((e.keyCode === 16 || e.keyCode === 17 || e.metaKey || e.keyCode === 224 || e.keyCode === 91 || e.keyCode === 93) && !list.multiSelect) {
            list.api.selection.setMultiSelect(true);
            list.multiSelect = true;
            list.allowCellEdit = false;
          }
        }).keyup(function (e) {
          if (e.keyCode === 16 || e.keyCode === 17 || e.metaKey || e.keyCode === 224 || e.keyCode === 91 || e.keyCode === 93) {
            list.api.selection.setMultiSelect(false);
            list.multiSelect = false;
            list.allowCellEdit = true;
          }
        });

        //handle case of meta-tab to other application
        //where keyup never happens and multi-select stays true
        $(window).blur(function() {
          list.api.selection.setMultiSelect(false);
          list.multiSelect = false;
          list.allowCellEdit = true;
        });

        //delete key brings up the delete confirm modal
        $('body').keydown(function (e) {
          if (e.keyCode === 8 || e.keyCode === 46) {
            if (event.target.nodeName !== 'INPUT') {
              e.preventDefault();
//            scope.deleteAction();
//              scope.$apply();  // seems to be necessary to update the view with any alerts
            }
          }
        });
      };

  });
