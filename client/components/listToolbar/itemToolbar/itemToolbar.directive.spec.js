'use strict';

describe('Directive: itemToolbar', function () {

  // load the directive's module and view
  beforeEach(module('prindleApp'));
  beforeEach(module('components/listToolbar/itemToolbar/itemToolbar.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<item-toolbar></item-toolbar>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the itemToolbar directive');
  }));
});