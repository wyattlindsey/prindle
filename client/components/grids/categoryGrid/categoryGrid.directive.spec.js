'use strict';

describe('Directive: categoryGrid', function () {

  // load the directive's module
  beforeEach(module('prindleApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<category-grid></category-grid>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the categoryGrid directive');
  }));
});