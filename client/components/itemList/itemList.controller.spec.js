'use strict';

describe('Controller: itemListCtrl', function () {

  // load the controller's module
  beforeEach(module('prindleApp'));

  var itemListCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    itemListCtrl = $controller('listGridCtrl', {
      $scope: scope
    });
  }));

//  it('should ...', function () {
//    expect(1).toEqual(1);
//  });
});
