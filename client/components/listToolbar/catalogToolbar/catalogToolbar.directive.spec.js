'use strict';

describe('Directive: catalogToolbar', function () {

  // load the directive's module and view
  beforeEach(angular.mock.module('prindleApp'));
  beforeEach(angular.mock.module('components/listToolbar/catalogToolbar/catalogToolbar.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

//  it('should make hidden element visible', inject(function ($compile) {
//    element = angular.element('<catalog-toolbar></catalog-toolbar>');
//    element = $compile(element)(scope);
//    scope.$apply();
//    expect(element.text()).toBe('this is the catalogToolbar directive');
//  }));
});