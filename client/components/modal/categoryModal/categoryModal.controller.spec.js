'use strict';

describe('Controller: categoryModalCtrl', function () {

  // load the controller's module
  beforeEach(module('prindleApp'));

  var categoryModalCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    categoryModalCtrl = $controller('categoryModalCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
