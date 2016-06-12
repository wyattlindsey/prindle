'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(angular.mock.module('prindleApp'));

  var ListyCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ListyCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    chai.expect(1).to.equal(1);
  });
});
