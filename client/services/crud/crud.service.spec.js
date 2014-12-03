'use strict';

var expect = chai.expect;
var should = chai.should;
var assert = chai.assert;


describe('Service: crud', function () {

  // load the service's module
  beforeEach(module('prindleApp'));

  // instantiate service
  var crud;
  var $q;
  var $rootScope;
  var $httpBackend;
  beforeEach(inject(function (_crud_, _$q_, _$rootScope_, _$httpBackend_) {
    crud = _crud_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
  }));

  var scopeData = {};
  scopeData.items = [];

  it('should add an item', function() {
    var newItem = {
      name: 'test item',
      weight: '100lb',
      category: 'default'
    };

    $httpBackend.expectPOST('/api/items', newItem).respond(200, '');
    var promise = crud.add(scopeData, 'items', newItem);


    $rootScope.$apply();

    expect(promise).to.be.an('object');


//    crud.add(scopeData, 'items', newItem).should




  });

});
