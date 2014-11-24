'use strict';

describe('Controller: listCatalogCtrl', function () {

  // load the controller's module
  beforeEach(module('prindleApp'));

  var ListcatalogCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ListcatalogCtrl = $controller('listCatalogCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
