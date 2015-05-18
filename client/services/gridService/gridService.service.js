'use strict';

angular.module('prindleApp')
  .service('gridService', function () {

    /**
     * The following event handlers ensure that clicks registered by a row during edits
     * don't trigger a select/deselect action for that row.
     */

    // selection behavior while editing

    this.registerSelectionEditEvents = function(scope, listView, state, listName) {

      // selection


      listView.api.selection.on.rowSelectionChanged(scope, function(row) {
        state.selected = listView.api.selection.getSelectedRows();

        var broadcastMessage = listName + 'ViewSelectionChanged';
        scope.$parent.$broadcast(broadcastMessage, row);

        if (listView.editInProgress) {
          scope.selectSingleRow(row.entity);
        }
      });

      listView.api.selection.on.rowSelectionChangedBatch(scope, function(rows) {
        state.selected = listView.api.selection.getSelectedRows();

        var broadcastMessage = listName + 'ViewMultipleSelected';
        scope.$parent.$broadcast(broadcastMessage, rows);
      });

      // cell editing

      listView.api.edit.on.beginCellEdit(scope, function(rowEntity, colDef) {
        state.editInProgress = true;
        scope.selectSingleRow(rowEntity);
        scope.$apply();
      });

      listView.api.edit.on.cancelCellEdit(scope, function(rowEntity, colDef) {
        state.editInProgress = false;
        scope.selectSingleRow(rowEntity);
        scope.$apply();
      });

      listView.api.edit.on.afterCellEdit(scope, function(rowEntity, colDef, newValue, oldValue) {
        state.editInProgress = false;
        if (newValue != oldValue) {
          scope.listUtil.update(listName, [rowEntity]);
          scope.selectSingleRow(rowEntity);
        }
      });
    };


    /**
     * The below is jQuery to deal with the shift and delete keys.
     * To do: use ui-grid as much as possible for this and move out into a controller-
     * independent service. << that's in progress now
     */

    this.registerKeyEvents = function(listView) {

      // keydown/keyup to enable/disable multi-select
      $('body').keydown(function (e) {
        if ((e.keyCode === 16 || e.keyCode === 17 || e.metaKey || e.keyCode === 224 || e.keyCode === 91 || e.keyCode === 93) && !listView.multiSelect) {
          listView.api.selection.setMultiSelect(true);
          listView.multiSelect = true;
          listView.allowCellEdit = false;
        }
      }).keyup(function (e) {
        if (e.keyCode === 16 || e.keyCode === 17 || e.metaKey || e.keyCode === 224 || e.keyCode === 91 || e.keyCode === 93) {
          listView.api.selection.setMultiSelect(false);
          listView.multiSelect = false;
          listView.allowCellEdit = true;
        }
      });

      //handle case of meta-tab to other application
      //where keyup never happens and multi-select stays true
      $(window).blur(function() {
        listView.api.selection.setMultiSelect(false);
        listView.multiSelect = false;
        listView.allowCellEdit = true;
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
