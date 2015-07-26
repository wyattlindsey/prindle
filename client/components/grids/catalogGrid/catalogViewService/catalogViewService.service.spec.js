'use strict';

describe('Service: catalogViewService', function () {

  // load the service's module
  beforeEach(module('prindleApp'));

  // instantiate service
  var catalogViewService;
  beforeEach(inject(function (_catalogViewService_) {
    catalogViewService = _catalogViewService_;
  }));

  it('should do something', function () {
    expect(!!catalogViewService).toBe(true);
  });

});
