'use strict';

describe('Controller: catalogToolbarCtrl', function () {

  // load the controller's module
  beforeEach(module('prindleApp'));

  var CatalogtoolbarCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CatalogtoolbarCtrl = $controller('catalogToolbarCtrl', {
      $scope: scope
    });
  }));


});
