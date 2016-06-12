'use strict';

// let Listy lighten the load

angular.module('prindleApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'ui.grid',
  'ui.grid.selection',
  'ui.grid.edit',
  'lvl.directives.dragdrop',
  'xeditable',
  'ngFileUpload',
  'popoverToggle'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');
    $locationProvider.html5Mode(true);
  })
