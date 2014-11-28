'use strict';

describe('Controller: listMainCtrl', function () {

  // load the controller's module
  beforeEach(module('prindleApp'));

  var ListmainCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ListmainCtrl = $controller('listMainCtrl', {
      $scope: scope
    });
  }));

//  it('should ...', function () {
//    expect(1).toEqual(1);
//  });
});
