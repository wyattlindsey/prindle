'use strict';

describe('Directive: listToolbar', function () {

  // load the directive's module and view
  beforeEach(angular.mock.module('prindleApp'));
  beforeEach(angular.mock.module('components/listToolbar/listToolbar.html'));

  var $compile,
    $rootScope,
    $controller;

  beforeEach(inject(function (_$compile_, _$rootScope_, _$controller_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $controller = _$controller_;
  }));

//  beforeEach(inject(function (_listToolbar_) {
//    listToolbar = _listToolbar_;
//  }));

  it('should work', function() {
    expect(1).to.equal(1);
  });

//  it('should initialize correctly', function() {
//    var element = $compile()
//  });

  // this would go in the child tests
//  it('places the correct elements in the toolbar', function() {
//    var listToolbar = $compile()($rootScope);
//  });

//  it('should make hidden element visible', inject(function ($compile) {
//    element = angular.element('<list-toolbar></list-toolbar>');
//    element = $compile(element)(scope);
//    scope.$apply();
//    expect(element.text()).toBe('this is the listToolbar directive');
//  }));
});