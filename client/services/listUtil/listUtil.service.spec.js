'use strict';

describe('Service: listUtil', function () {

  // load the service's module
  beforeEach(module('prindleApp'));

  // instantiate service
  var listUtil;
  beforeEach(inject(function (_listUtil_) {
    listUtil = _listUtil_;
  }));

  it('should do something', function () {
    expect(!!listUtil).toBe(true);
  });

});
