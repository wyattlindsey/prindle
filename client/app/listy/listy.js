'use strict';

angular.module('prindleApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('listy', {
        url: '/listy',
        templateUrl: 'app/listy/listy.html',
        controller: 'ListyCtrl'
      });
  });