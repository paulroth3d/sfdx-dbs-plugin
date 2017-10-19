/*jshint esversion: 6*/

//-- include your modules
const AbortedPromise = require('../../lib/validate/AbortedPromise');
const _ = require('underscore');
const Q = require('q');
var assert = require('assert');
let scope = this;

describe('validate/AbortedPromise', function (){
  it('aborts promise portals arguments', function(done){
    try {
      Q.when()
        .then(function(){
          return AbortedPromise.abort(scope, 'abort', {param:'some param'});
        })
        .then(function(){
          console.log('should never get here');
          assert.equal(true,false,'abort should stop the promise chain');
          done();
        })
        .catch(function(argMessage, argObj){
          assert.equal(argMessage,'abort','first argument should be abort, because that was passed first');
          done();
        });
    } catch(err){
      assert.equal(true, false, 'not expecting any errors');
    }
  });
});