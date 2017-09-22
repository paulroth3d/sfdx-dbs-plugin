var sayHelloModule = require('../commands/example/example_sayHello');
var assert = require('assert');

describe('Hello World', function (){
  
  it('says hello', function(done){
    sayHelloModule.sayHello({msg:'Hello'})
      .then(function(response){
        var expectedResponse = 'Polly says:"Hello". Bawk.';
        assert.equal(expectedResponse, response, 'Expect to parrot back msg sent');
        done();
      })
      .catch(function(err){
        assert.fail('Exception should not be found:' + JSON.stringify(err));
        done();
      });
  });
  
  it('says polly want a cracker', function(done){
    sayHelloModule.sayHello({msg:'Polly want a cracker'})
      .then(function(response){
        var expectedResponse = 'Polly says:"Polly want a cracker". Bawk.';
        assert.equal(expectedResponse, response, 'Expect to parrot back msg sent');
        done();
      })
      .catch(function(err){
        assert.fail('exception should not be found:' + JSON.stringify(arguments));
        done();
      });
  });
});
