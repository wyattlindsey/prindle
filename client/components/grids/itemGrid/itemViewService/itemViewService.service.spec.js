'use strict';

describe('Service: itemViewService', function () {

  // load the service's module
  beforeEach(module('prindleApp'));

  // instantiate service
  var itemViewService;
  beforeEach(inject(function (_itemViewService_) {
    itemViewService = _itemViewService_;
  }));

  it('should do something', function () {
    expect(!!itemViewService).toBe(true);
  });

});
