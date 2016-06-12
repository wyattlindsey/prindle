'use strict';

describe('Service: categoryService', function () {

  // load the service's module
  beforeEach(angular.mock.module('prindleApp'));

  // instantiate service
  var categoryService;
  beforeEach(inject(function (_categoryService_) {
    categoryService = _categoryService_;
  }));

  it('should have the add function', function () {
    categoryService.add('test');
  });

});
