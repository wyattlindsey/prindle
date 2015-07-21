'use strict';

angular.module('prindleApp')
  .service('categoryService', ['$rootScope', 'appData', 'listUtil', function ($rootScope, appData, listUtil) {

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


    $rootScope.$on('got-category-from-singleFieldModal', function(event, name) {
      add(name);
    });


    var add = function(name) {
      listUtil.add('categories', {name: name})
        .then(function() {
          listUtil.get('categories')
            .then(function(categories) {
              appData.data.categories = categories;
              $rootScope.$broadcast('categories-loaded');
            });
        });
    };


  }]);
