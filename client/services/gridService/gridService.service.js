'use strict';

angular.module('prindleApp')
  .service('gridService', ['guiState', 'listUtil', function (guiState, listUtil) {

    /**
     * The following event handlers ensure that clicks registered by a row during edits
     * don't trigger a select/deselect action for that row.
     */

    // selection behavior while editing

    this.registerSelectionEditEvents = function(scope, listView, listName) {

      // selection

      listView.api.selection.on.rowSelectionChanged(scope, function(row) {
        var rows = [row];
        processSelectionChange(rows);
      });

      listView.api.selection.on.rowSelectionChangedBatch(scope, function(rows) {
        processSelectionChange(rows);
      });

      var processSelectionChange = function(rows) {
        var selectedRows = listView.api.selection.getSelectedRows();
        guiState.state[listName].selected = selectedRows;

        var deletable = _.filter(guiState.state[listName].selected, function(selectedItem) {
          return !selectedItem.readOnly;
        });

        if (deletable.length < guiState.state[listName].selected.length) {  // if any item isn't deleteble, then no item shall be deleted
          guiState.state[listName].selectionDeletable = false;
        } else {
          guiState.state[listName].selectionDeletable = true;
        }

        if (guiState.state[listName].selected.length > 1) {
          guiState.state[listName].multipleItemsSelected = true;
        } else {
          guiState.state[listName].multipleItemsSelected = false;
        }
        var broadcastMessage = listName + '-selection-changed';
        scope.$parent.$broadcast(broadcastMessage, rows);

        if (guiState.state[listName].editInProgress && !guiState.state[listName].multipleItemsSelected) {
          selectSingleRow(listName, rows[0].entity, listView);
        }
      };

      // cell editing

      listView.api.edit.on.beginCellEdit(scope, function(rowEntity) {
        guiState.state[listName].editInProgress = true;
        selectSingleRow(listName, rowEntity, listView);
        scope.$apply();
      });

      listView.api.edit.on.cancelCellEdit(scope, function(rowEntity) {
        guiState.state[listName].editInProgress = false;
        selectSingleRow(listName, rowEntity, listView);
        scope.$apply();
      });

      listView.api.edit.on.afterCellEdit(scope, function(rowEntity, colDef, newValue, oldValue) {
        guiState.state[listName].editInProgress = false;
        if (newValue != oldValue) {
          listUtil.update(listName, [rowEntity]);
          selectSingleRow(listName, rowEntity, listView);
        }
      });
    };

    var selectSingleRow = function(listName, rowEntity, listView) {
      if (guiState.state[listName].editInProgress) {
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
  }]);
