'use strict';

describe('Directive: listToolbar', function () {

  // load the directive's module and view
  beforeEach(angular.mock.module('prindleApp'));
  beforeEach(angular.mock.module('components/listToolbar/listToolbar.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

//  it('should make hidden element visible', inject(function ($compile) {
//    element = angular.element('<list-toolbar></list-toolbar>');
//    element = $compile(element)(scope);
//    scope.$apply();
//    expect(element.text()).toBe('this is the listToolbar directive');
//  }));
});