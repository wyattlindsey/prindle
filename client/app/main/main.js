'use strict';

angular.module('prindleApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });


    // prevent ui-grid search fields from being available as drop targets
    angular.element(document.body).bind('dragover', function(e) {
      e.preventDefault();
      return false;
    });
  });
