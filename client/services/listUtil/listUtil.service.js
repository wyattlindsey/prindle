'use strict';

/**
 * This service is an effort to pull common functionality out of the item and catalog lists
 *
 */

angular.module('prindleApp')
  .service('listUtil', ['$rootScope', '$q', 'crud', 'appData', function ($rootScope, $q, crud, appData) {

    this.get = function(listName) {
      var deferred = $q.defer();

      crud.get(listName)
        .then(function(data) {
          deferred.resolve(data);
        });

      return deferred.promise;
    };


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
          deferred.reject('add record(s) failed in listUtil: ' + err);
        } else {
          $rootScope.$broadcast(('added-to-' + listName), addedItems);
          crud.get(listName)
            .then(function(data) {
              appData.data[listName] = data;
              deferred.resolve(data);
              $rootScope.$broadcast(('refresh-' + listName), data);
            });
        }
      });

      return deferred.promise;
    };


    this.copy = function(listName, entries) {

      var deferred = $q.defer();

      var copiedItems = [];

      async.each(entries, function(entry, callback) {
        var itemCopy = {};
        angular.copy(entry, itemCopy);
        delete itemCopy['_id'];
        itemCopy['readOnly'] = false;        // copied items aren't read-only
        itemCopy['name'] = 'copy of ' + entry['name'];
        crud.add(listName, itemCopy)
          .then(function(newItem) {
            copiedItems.push(newItem);
            $rootScope.$broadcast(('copied-' + listName), {src: entry, dest: newItem});
            callback();
          });
      }, function(err) {
        if(err) {
          deferred.reject('error copying item(s) in listUtil: ' + err);
        } else {
          $rootScope.$broadcast(('added-to-' + listName), copiedItems);
          crud.get(listName)
            .then(function(data) {
              appData.data[listName] = data;
              deferred.resolve(data);
              $rootScope.$broadcast(('refresh-' + listName), data);
            });
        }
      });

      return deferred.promise;
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
          deferred.resolve();
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
              appData.data[listName] = data;
              var broadcastString = 'refresh-' + listName;
              $rootScope.$broadcast(broadcastString, data);
            });
        }
      });
    };

  }]);
