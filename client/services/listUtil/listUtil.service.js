'use strict';

/**
 * This service is an effort to pull common functionality out of the item and catalog lists
 *
 */

angular.module('prindleApp')
  .service('listUtil', function ($rootScope, crud) {

    this.add = function(listName, newEntryData) {
      async.each(newEntryData, function(entry, callback) {
        crud.add(listName, entry)
          .then(function(data) {
            var broadcastString = 'addedto' + listName;
            $rootScope.$broadcast(broadcastString, data);
            callback();
          });
      }, function(err) {
        if (err) {
          console.log('error adding item(s)');
        } else {
          crud.get(listName)
            .then(function(data) {
              var broadcastString = 'redraw' + listName;
              $rootScope.$broadcast(broadcastString, data);
            });
        }
      });
    };

    this.copy = function(listName, entries) {
      async.each(entries, function(entry, callback) {
        delete entry['_id'];
        entry['readOnly'] = false;        // copied items aren't read-only
        entry['name'] = 'copy of ' + entry['name'];
        crud.add(listName, entry).then(function() {
          callback();
        });
      }, function(err) {
        if(err) {
          console.log('error processing copy');
        } else {
          crud.get(listName)
          .then(function(data) {
            var broadcastString = 'redraw' + listName;
            $rootScope.$broadcast(broadcastString, data);
          });
        }
      });
    };

    this.update = function(listName, editedEntries) {
      console.log(editedEntries);
      async.each(editedEntries, function(entry, callback) {
        crud.update(listName, entry._id, entry);
      }, function(err) {
        if (err) {
          console.log('error editing entry');
        } else {
          crud.get(listName)
            .then(function(data) {
              var broadcastString = 'redraw' + listName;
              $rootScope.$broadcast(broadcastString, data);
            });
        }
      });
    };

    this.delete = function(listName, entries ) {
      async.each(entries, function(entry, callback) {
        crud.remove(listName, entry._id).then(function() {
          var broadcastString = 'deletedfrom' + listName;
          $rootScope.$broadcast(broadcastString, entry._id);
          callback();
        });
      }, function(err) {
        if(err) {
          console.log('error processing delete');
        } else {
          crud.get(listName)
            .then(function(data) {
              var broadcastString = 'redraw' + listName;
              $rootScope.$broadcast(broadcastString, data);
            });
        }
      });
    };

  });
