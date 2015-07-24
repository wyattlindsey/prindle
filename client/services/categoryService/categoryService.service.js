'use strict';

angular.module('prindleApp')
  .service('categoryService', ['$rootScope', '$q', 'appData', 'listUtil',
    function ($rootScope, $q, appData, listUtil) {

    var unregisterLoadCategories = $rootScope.$on('items-loaded', function() {
      listUtil.get('categories')
        .then(function(categories) {
          appData.data.categories = categories;
          $rootScope.$broadcast('categories-loaded');
          unregisterLoadCategories();
        });
    });

    $rootScope.$on('added-to-items', function(event, items) {
      _.forEach(items, function(item) {
        var category = item.category;
        var found = _.findWhere(appData.data.categories, {name: category});
        if (!found) {
          listUtil.add('categories', {name: category})
            .then(function() {
              listUtil.get('categories')
                .then(function(categories) {
                  appData.data.categories = categories;
                  $rootScope.$broadcast('categories-loaded');
                });
            });
        }
      });
    });



    this.add = function(name) {

      var deferred = $q.defer();

      if (typeof(_.find(appData.data.categories, {'name': name})) === 'undefined') {
        listUtil.add('categories', {name: name})
          .then(function () {
            listUtil.get('categories')
              .then(function (categories) {
                appData.data.categories = categories;
                deferred.resolve();   // need reject for error
              });
          });
      } else {
        // alert because the name isn't unique - use deferred.reject()?
      }

      return deferred.promise;
    };


  }]);
