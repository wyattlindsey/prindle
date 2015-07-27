'use strict';

describe('Controller: CategorygridCtrl', function () {

  // load the controller's module
  beforeEach(module('prindleApp'));

  var CategorygridCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CategorygridCtrl = $controller('CategorygridCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
