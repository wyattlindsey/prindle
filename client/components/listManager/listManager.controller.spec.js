'use strict';

describe('Controller: listManagerCtrl', function () {

  // load the controller's module
  beforeEach(module('prindleApp'));

  var listManagerCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    listManagerCtrl = $controller('listManagerCtrl', {
      $scope: scope
    });
  }));

//  it('should ...', function () {
//    expect(1).toEqual(1);
//  });
});
