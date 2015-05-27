'use strict';

/**
 * This service is an effort to pull common functionality out of the item and catalog lists
 *
 */

angular.module('prindleApp')
  .service('listUtil', function ($rootScope, $q, crud) {


    this.add = function(listName, newEntryData) {
      var deferred = $q.defer();

      var addedItems = [];

      async.each(newEntryData, function(entry, callback) {
        crud.add(listName, entry)
          .then(function(data) {
            addedItems.push(data);
            callback();
          });
      }, function(err) {
        if (err) {
          deferred.reject('add record(s) failed in listUtil ' + err);
        } else {
          $rootScope.$broadcast(('added-to-' + listName), addedItems);
          crud.get(listName)
            .then(function(data) {
              deferred.resolve();
              var broadcastString = 'refresh-' + listName;
              $rootScope.$broadcast(broadcastString, data);
            });
        }
      });

      return deferred.promise;
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
            var broadcastString = 'refresh' + listName;
            $rootScope.$broadcast(broadcastString, data);
          });
        }
      });
    };

    this.update = function(listName, editedEntries) {
      var deferred = $q.defer();

      async.each(editedEntries, function(entry, callback) {
        crud.update(listName, entry._id, entry).then(function() {
          callback();
        });
      }, function(err) {
        if (err) {
          console.log('error editing entry');
          deferred.reject('error updating record in listUtil: ' + err);
        } else {
          crud.get(listName)
            .then(function(data) {
              $rootScope.$broadcast(('refresh-' + listName + '-data'), data);
              deferred.resolve();
            });
        }
      });

      return deferred.promise;
    };

    this.delete = function(listName, entries ) {
      async.each(entries, function(entry, callback) {
        crud.remove(listName, entry._id).then(function() {
          $rootScope.$broadcast(('deleted-from-' + listName), entry);
          callback();
        });
      }, function(err) {
        if(err) {
          console.log('error processing delete');
        } else {
          crud.get(listName)
            .then(function(data) {
              var broadcastString = 'refresh-' + listName;
              $rootScope.$broadcast(broadcastString, data);
            });
        }
      });
    };

  });
