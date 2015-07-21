'use strict';

describe('Controller: categoriesModalCtrl', function () {

  // load the controller's module
  beforeEach(module('prindleApp'));

  var CategoriesmodalCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CategoriesmodalCtrl = $controller('categoriesModalCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
