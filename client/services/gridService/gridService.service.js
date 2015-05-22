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
        var rows = [row];
        processSelectionChange(rows);
      });

      listView.api.selection.on.rowSelectionChangedBatch(scope, function(rows) {
        processSelectionChange(rows);
      });

      var processSelectionChange = function(rows) {
        state.selected = listView.api.selection.getSelectedRows();

        var deleteable = _.filter(state.selected, function(selectedItem) {
          return !selectedItem.readOnly;
        });

        if (deleteable.length < state.selected.length) {  // if any item isn't deletable, then no item shall be deleted
          state.selectionDeletable = false;
        } else {
          state.selectionDeletable = true;
        }

        if (state.selected.length > 1) {
          state.multipleItemsSelected = true;
        } else {
          state.multipleItemsSelected = false;
        }
        var broadcastMessage = listName + 'SelectionChanged';
        scope.$parent.$broadcast(broadcastMessage, rows);

        if (state.editInProgress && !state.multipleItemsSelected) {
          selectSingleRow(rows[0].entity, listView, state);
        }
      };

      // cell editing

      listView.api.edit.on.beginCellEdit(scope, function(rowEntity, colDef) {
        state.editInProgress = true;
        selectSingleRow(rowEntity, listView, state);
        scope.$apply();
      });

      listView.api.edit.on.cancelCellEdit(scope, function(rowEntity, colDef) {
        state.editInProgress = false;
        selectSingleRow(rowEntity, listView, state);
        scope.$apply();
      });

      listView.api.edit.on.afterCellEdit(scope, function(rowEntity, colDef, newValue, oldValue) {
        state.editInProgress = false;
        if (newValue != oldValue) {
          scope.listUtil.update(listName, [rowEntity]);
          selectSingleRow(rowEntity, listView, state);
        }
      });
    };

    var selectSingleRow = function(rowEntity, listView, state) {
      if (state.editInProgress) {
        listView.api.selection.selectRow(rowEntity);
      }
    };


    /**
     * The below is jQuery to deal with the shift and delete keys.
     * To do: use ui-grid as much as possible for this and move out into a `controller-
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
