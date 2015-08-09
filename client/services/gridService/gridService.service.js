'use strict';

angular.module('prindleApp')
  .service('gridService', ['guiState', 'listUtil', function (guiState, listUtil) {

    /**
     * The following event handlers ensure that clicks registered by a row during edits
     * don't trigger a select/deselect action for that row.
     */

    // selection behavior while editing

    this.registerSelectionEditEvents = function(scope, listView, listName, editable) {

      // selection

      listView.api.selection.on.rowSelectionChanged(scope, function(row) {
        var rows = [row];
        processSelectionChange(rows);
      });

      listView.api.selection.on.rowSelectionChangedBatch(scope, function(rows) {
        processSelectionChange(rows);
      });

      scope.$parent.$on('clear-selected-items', function() {
        if (listName === 'items') {
          listView.api.selection.clearSelectedRows();
        }
      });

      var processSelectionChange = function(rows) {


        // load in new selections on selection change
        var selectedRows = listView.api.selection.getSelectedRows();
        guiState.state[listName].selected = selectedRows;

        // if any item isn't deletable, then no item shall be deleted
        var deletable = _.filter(guiState.state[listName].selected, function(selectedItem) {
          return !selectedItem.readOnly;
        });
        if (deletable.length < guiState.state[listName].selected.length) {
          guiState.state[listName].selectionDeletable = false;
        } else {
          guiState.state[listName].selectionDeletable = true;
        }

        // keep track of multiselection state
        if (guiState.state[listName].selected.length > 1) {
          guiState.state[listName].multipleItemsSelected = true;
        } else {
          guiState.state[listName].multipleItemsSelected = false;
        }

        scope.$parent.$broadcast((listName + '-selection-changed'), rows);

        // when the selection changes due to clicking during an edit-in-place operation,
        // make sure row remains selected
        if (guiState.state[listName].editInProgress && !guiState.state[listName].multipleItemsSelected) {
          selectSingleRow(listName, rows[0].entity, listView);
        }
      };

      // cell editing - keeps track of editing status and keeps rows selected at the
      // appropriate times
      if (editable || typeof editable == 'undefined') {

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

          // need to check for duplicates here

          guiState.state[listName].editInProgress = false;
          if (newValue !== oldValue && !rowEntity.readOnly && newValue !== '') {

            listUtil.update(listName, rowEntity)
              .then(function() {

              }, function(err) {
                throw new Error(err);
              });
            selectSingleRow(listName, rowEntity, listView);
            scope.$parent.$broadcast('updated-' + listName, { 'oldValue': oldValue, 'newValue': newValue });

          } else { // don't change readOnly records or update if value is blank

            rowEntity[colDef.field] = oldValue;
            selectSingleRow(listName, rowEntity, listView);
          }
        });
      }
    };


    var selectSingleRow = function(listName, rowEntity, listView) {
      listView.api.selection.selectRow(rowEntity);
    };


    /**
     * The below is jQuery to deal with the shift and delete keys.
     **/

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
