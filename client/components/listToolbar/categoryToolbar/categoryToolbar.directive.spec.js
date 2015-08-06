'use strict';

describe('Directive: categoryToolbar', function () {

  // load the directive's module and view
  beforeEach(module('prindleApp'));
  beforeEach(module('components/listToolbar/categoryToolbar/categoryToolbar.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<category-toolbar></category-toolbar>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the categoryToolbar directive');
  }));
});