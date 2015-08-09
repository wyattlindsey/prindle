'use strict';

angular.module('prindleApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('listy', {
        url: '/listy',
        templateUrl: 'app/listy/listy.html',
        controller: 'ListyCtrl'
      });


    // prevent ui-grid search fields from being available as drop targets
    angular.element(document.body).bind('dragover', function(e) {
      e.preventDefault();
      return false;
    });
  });