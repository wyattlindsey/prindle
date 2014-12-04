'use strict';

describe('Controller: catalogListCtrl', function () {

  // load the controller's module
  beforeEach(module('prindleApp'));

  var catalogListCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    catalogListCtrl = $controller('catalogListCtrl', {
      $scope: scope
    });
  }));
//
//  it('should ...', function () {
//    expect(1).toEqual(1);
//  });
});
