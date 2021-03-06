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
          appData.data[listName] = data;
          deferred.resolve(data);
        }, function(err) {
          deferred.reject(err);
        });

      return deferred.promise;
    };


    this.show = function(listName, id) {
      var deferred = $q.defer();

      crud.show(listName, id)
        .then(function(data) {
          // find and update??
          deferred.resolve(data);
        }, function(err) {
          deferred.reject(err);
        });

      return deferred.promise;
    };


    this.add = function(listName, newEntryData) {
      var deferred = $q.defer();

      var addedItems = [];

      if (!Array.isArray(newEntryData)) {
        newEntryData = [newEntryData];
      }

      async.each(newEntryData, function(entry, callback) {
        crud.add(listName, entry)
          .then(function(data) {
            addedItems.push(data);
            callback();
          }, function(err) {
            deferred.reject('add record(s) failed in listUtil: ' + err);
          });
      }, function(err) {
        if (err) {
          deferred.reject('add record(s) failed in listUtil: ' + err);
        } else {
          appData.data[listName] = appData.data[listName].concat(addedItems);
          $rootScope.$broadcast(('added-to-' + listName), addedItems);
          deferred.resolve();
        }
      });

      return deferred.promise;
    };


    this.copy = function(listName, entries) {

      var deferred = $q.defer();

      var copiedItems = [];

      if (!Array.isArray(entries)) {
        entries = [entries];
      }

      async.each(entries, function(entry, callback) {
        var itemCopy = {};
        angular.copy(entry, itemCopy);
        delete itemCopy['_id'];
        itemCopy['readOnly'] = false;        // copied items aren't read-only
        itemCopy['name'] = 'copy of ' + entry['name'];
        crud.add(listName, itemCopy)
          .then(function(newItem) {
            copiedItems.push(newItem);
            callback();
          }, function(err) {
            deferred.reject('error copying item(s) in listUtil: ' + err);
          });
      }, function(err) {
        if(err) {
          deferred.reject('error copying item(s) in listUtil: ' + err);
        } else {
          appData.data[listName] = appData.data[listName].concat(copiedItems);
          $rootScope.$broadcast(('added-to-' + listName), copiedItems);
          deferred.resolve(copiedItems);
        }
      });

      return deferred.promise;
    };


    this.update = function(listName, editedEntries) {
      var deferred = $q.defer();

      var entries = [];

      if (!Array.isArray(editedEntries)) {
        editedEntries = [editedEntries];
      }

      async.each(editedEntries, function(entry, callback) {
        crud.update(listName, entry._id, entry)
          .then(function() {
            entries.push(entry);
            callback();
          }, function(err) {
            deferred.reject('error updating record in listUtil: ' + err);
          });
        }, function(err) {
          if (err) {
            deferred.reject('error updating record in listUtil: ' + err);
          } else {
            $rootScope.$broadcast('updated-' + listName, entries);
            if (entries.length === 1 ) {
              deferred.resolve(entries[0]);
            } else if (entries.length > 1) {
              deferred.resolve(entries)
            } else {
              deferred.resolve(false);    // hmm
            }
          }
        });

      return deferred.promise;
    };


    this.delete = function(listName, entries) {

      var deferred = $q.defer();

      if (!Array.isArray(entries)) {
        entries = [entries];
      }

      async.each(entries, function(entry, callback) {
        crud.delete(listName, entry._id).then(function() {
          appData.data[listName] = _.filter(appData.data[listName], function(listMember) {
            return listMember._id !== entry._id;
          });
          $rootScope.$broadcast(('deleted-from-' + listName), [entry]);
          callback();
        }, function(err) {
          deferred.reject('error deleting item(s) in listUtil: ' + err);
        });
      }, function(err) {
        if(err) {
          deferred.reject('error deleting item(s) in listUtil: ' + err);
        } else {
          deferred.resolve();
        }
      });

      return deferred.promise;
    };


    this.getImage = function(entry) {

      var deferred = $q.defer();
      crud.show('images', entry.imageID)
        .then(function(image, err) {      // not sure if those are the correct callback parameters
          if(err) {
            deferred.reject('error showing image in listUtil: ' + err);
          } else {
            deferred.resolve(image);
          }
        });

      return deferred.promise;
    };


  }]);