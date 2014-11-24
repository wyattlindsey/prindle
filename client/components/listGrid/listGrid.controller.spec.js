'use strict';

describe('Controller: listGridCtrl', function () {

  // load the controller's module
  beforeEach(module('prindleApp'));

  var ListgridCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ListgridCtrl = $controller('listGridCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
