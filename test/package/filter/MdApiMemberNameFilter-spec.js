/*jshint esversion: 6*/

//-- include your modules
const MdApiMemberNameFilter = require('../../../lib/package/filter/MdApiMemberNameFilter');
const MdApiPackage = require('../../../lib/package/MdApiPackage');
const MdApiPackageMember = MdApiPackage.member;
const _ = require('underscore');
const Q = require('q');
var assert = require('assert');

describe('package/filter/MdApiMemberNameFilter', function (){
  it('filters a member pattern', function(done){
    let singleMember = new MdApiPackageMember('ApexClass','','LN_SomeClass');
    let sampleFilter = new MdApiMemberNameFilter('^LN_');
    let filterResults = sampleFilter.apply([singleMember]);
    assert.equal(filterResults.length, 1, 'Member LN_SomeClass starts with LN_, so at least one thing must be returned');
    assert.deepEqual(filterResults[0], singleMember, 'The single member must be found');
    done();
  });

  it('does not filter if the filters do not apply', function(done){
    let singleMember = new MdApiPackageMember('ApexClass','','LN_SomeClass');
    let sampleFilter = new MdApiMemberNameFilter('^LNE_');
    let filterResults = sampleFilter.apply([singleMember]);
    assert.equal(filterResults.length, 0, 'Member LN_SomeClass DOES NOT start with LNE_, so no members should be returned');
    done();
  });

  it('filters collections of members', function(done){
    let mixedMembers = [
      new MdApiPackageMember('ApexClass','','LN_SomeClass'),
      new MdApiPackageMember('ApexClass','','LNE_SomeClass')
    ];
    let sampleFilter = new MdApiMemberNameFilter('^LN_');
    let filterResults = sampleFilter.apply(mixedMembers);
    assert.equal(filterResults.length, 1, 'Member LN_SomeClass starts with LN_, so at least one thing must be returned');
    assert.deepEqual(filterResults[0], mixedMembers[0], 'The single member must be found');
    done();
  });
  
  it('filters member strings', function(done){
    let mixedMembers = [
      new MdApiPackageMember('ApexClass','','LN_SomeClass'),
      new MdApiPackageMember('ApexClass','','LNE_SomeClass')
    ];
    let sampleFilter = new MdApiMemberNameFilter('LN_');
    let filterResults = sampleFilter.apply(mixedMembers);
    assert.equal(filterResults.length, 1, 'Member LN_SomeClass starts with LN_, so at least one thing must be returned');
    assert.deepEqual(filterResults[0], mixedMembers[0], 'The single member must be found');
    done();
  });
});