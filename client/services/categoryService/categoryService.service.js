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


  }]);
