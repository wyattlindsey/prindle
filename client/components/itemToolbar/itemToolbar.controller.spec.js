'use strict';

describe('Controller: itemToolbarCtrl', function () {

  // load the controller's module
  beforeEach(module('prindleApp'));

  var ItemtoolbarCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ItemtoolbarCtrl = $controller('itemToolbarCtrl', {
      $scope: scope
    });
  }));

});
