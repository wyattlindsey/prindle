'use strict';

describe('Controller: ListyCtrl', function () {

  // load the controller's module
  beforeEach(module('prindleApp'));

  var ListyCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ListyCtrl = $controller('ListyCtrl', {
      $scope: scope
    });
  }));
//
//  it('should ...', function () {
//    expect(1).toEqual(1);
//  });
});