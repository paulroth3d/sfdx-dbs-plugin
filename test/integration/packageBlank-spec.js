/*eslint quotes: ['error', 'single']*/

let _ = require('underscore');
let assert = require('assert');
let fs = require('fs-extra');

const command = require('../../commands/package/package_blank');

//-- move JSON.stringify(context) here
const context = {'topic':null,'command':{'topic':'package','command':'blank','plugin':'sfdx-dbs-plugin','namespace':'dbs','usage':'','description':'Creates a blank package','default':false,'help':'Creates a blank package','fullHelp':'','hidden':false,'variableArgs':false,'disableAnalytics':false,'args':null,'flags':[{'name':'targetPath','char':'t','description':'Path for the resulting package (xml) file','hasValue':true,'hidden':false,'required':false},{'name':'apiVersion','char':'a','description':'api version for the package, DEF:40.0','hasValue':true,'hidden':false,'required':false}]},'app':'','args':{},'flags':{'targetPath':'testAssets/packages/blank.xml'},'cwd':'/Users/proth/Documents/work/tools/sfdx-dbs-plugin','herokuDir':'/Users/proth/.cache/sfdx','debug':false,'debugHeaders':false,'dev':true,'supportsColor':true,'version':'sfdx-cli/5.7.7-94c4196 (darwin-amd64) go1.7.5 sfdx-dbs-plugin/0.0.1 node-v6.9.5','apiToken':'','apiHost':'api.heroku.com','apiUrl':'https://api.heroku.com','gitHost':'heroku.com','httpGitHost':'git.heroku.com'};//-- replace with JSON.stringify(context) from a running request

//-- @TODO: do more than just poor man's integration test

describe('package/blank', function(done){
  
  it('creates a blank package', function(done){
    this.timeout(10000);
    try {
      command.run(context)
        .then(function(){
          assert.equal(true,true, 'no exception should be thrown');
          done();
        })
        .catch(function(){
          assert.fail('no exceptions should be thrown when compressing');
          done();
        })
        .done();
    } catch(err){
      assert.fail('exception happened while running command:' + JSON.stringify(arguments));
    }
  });
});