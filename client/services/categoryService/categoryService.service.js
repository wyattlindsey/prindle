'use strict';

angular.module('prindleApp')
  .service('categoryService', ['$rootScope', '$q', 'appData', 'listUtil',
    function ($rootScope, $q, appData, listUtil) {

      var unregisterLoadCategories = $rootScope.$on('items-loaded', function () {
        listUtil.get('categories')
          .then(function (categories) {
            appData.data.categories = categories;
            $rootScope.$broadcast('categories-loaded');
            unregisterLoadCategories();
          }, function(err) {
            throw new Error(err);
          });
      });

      $rootScope.$on('added-to-items', function (event, items) {
        _.forEach(items, function (item) {
          var category = item.category;
          var found = _.findWhere(appData.data.categories, {name: category});
          if (!found && category !== '' && typeof(category) !== 'undefined') {
            listUtil.add('categories', {name: category, readOnly: false})
              .then(function () {
                listUtil.get('categories')
                  .then(function (categories) {
                    appData.data.categories = categories;
                    $rootScope.$broadcast('categories-loaded');
                  });
              }, function(err) {
                throw new Error(err);
              });
          }
        });
      });


      this.get = function() {
        return appData.data.categories;
      };


      this.add = function (name) {

        var deferred = $q.defer();

        if (typeof(_.find(appData.data.categories, {'name': name})) === 'undefined'
          && name !== '') {
          listUtil.add('categories', {'name': name, 'readOnly': false})
            .then(function () {
              listUtil.get('categories')
                .then(function (categories) {
                  appData.data.categories = categories;
                  deferred.resolve();   // need reject for error
                });
            }, function(err) {
              throw new Error(err);
            });
        } else {
          deferred.resolve();
          // alert because the name isn't unique - use deferred.reject()?
        }

        return deferred.promise;
      };


      this.update = function (category, oldName) {

        var deferred = $q.defer();

        listUtil.update('categories', category)
          .then(function() {
            _.forEach(appData.data.items, function (item) {
              if (item.category === oldName) {
                item.category = category.name;
                listUtil.update('items', item);
              }
            });
            deferred.resolve();
          }, function(err) {
            throw new Error(err);
          });
      };


      this.delete = function (category) {

        var deferred = $q.defer();

        listUtil.delete('categories', category)
          .then(function () {
            _.forEach(appData.data.items, function (item) {
              if (item.category === category.name) {
                item.category = '';
                listUtil.update('items', item);
              }
            }, function(err) {
              throw new Error(err);
            });
            deferred.resolve();
          });

        return deferred.promise;
      };


    }]);
