var subCommandModule = require('../../commands/example/example_subCommand');
var assert = require('assert');

describe('Sub Command runs', function (){
  it('opens with a fake topic', function(done){
    try {
      subCommandModule.run({});
      assert.equal(true,true,'No exceptions should have been called.');
      done();
    } catch(err){
      assert.fail('exception should not be thrown');
      done();
    }
  });
});
