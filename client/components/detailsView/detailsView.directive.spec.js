'use strict';

describe('Directive: detailsView', function () {

  // load the directive's module and view
  beforeEach(module('prindleApp'));
  beforeEach(module('components/detailsView/detailsView.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<details-view></details-view>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the detailsView directive');
  }));
});