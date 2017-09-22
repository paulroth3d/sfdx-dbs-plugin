/*eslint quotes: ['error', 'single']*/
/*jshint esversion: 6, quotmark: single */

let _ = require('underscore');
let compressModule = require('../commands/compress/dir');
let assert = require('assert');
let fs = require('fs-extra');

//-- @TODO: provide more robust tests for compressing.

describe('Compress/Dir', function(done){
  
  it('runs tests', function(done){
    try {
      compressModule.run({flags:{source:'./commands', target:'./commands.zip'}})
        .then(function(){
          assert.equal(true,true, 'no exception should be thrown');
          fs.remove('../commands.zip', function(err){
            done();
          });
        })
        .catch(function(){
          assert.fail('no exceptions should be thrown when compressing');
          done();
        });
    } catch(err){
      assert.fail('exception happened while compressing:' + JSON.stringify(arguments));
    }
  });

});