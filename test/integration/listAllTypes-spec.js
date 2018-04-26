/*eslint quotes: ['error', 'single']*/

let _ = require('underscore');
let assert = require('assert');
let fs = require('fs-extra');

const allTypesCommand = require('../../commands/list/list_allTypes');

const targetOrg=process.env.targetOrg || 'lightningSupport';
const context = {'topic':null,'command':{'topic':'list','command':'allTypes','plugin':'sfdx-dbs-plugin','namespace':'dbs','usage':'','description':'Manually adds an item to a packageList','default':false,'help':'Manually adds an item to a packageList','fullHelp':'','hidden':false,'variableArgs':false,'disableAnalytics':false,'args':null,'flags':[{'name':'alias','char':'a','description':'Connection alias','hasValue':true,'hidden':false,'required':false}]},'app':'','args':{},'flags':{'alias': targetOrg},'cwd':'/Users/proth/Documents/work/tools/sfdx-dbs-plugin','herokuDir':'/Users/proth/.cache/sfdx','debug':false,'debugHeaders':false,'dev':true,'supportsColor':true,'version':'sfdx-cli/5.7.7-94c4196 (darwin-amd64) go1.7.5 sfdx-dbs-plugin/0.0.1 node-v6.9.5','apiToken':'','apiHost':'api.heroku.com','apiUrl':'https://api.heroku.com','gitHost':'heroku.com','httpGitHost':'git.heroku.com'};

//-- @TODO: do more than just poor man's integration test

describe('list/allTypes', function(done){
  
  it('runs command', function(done){
    this.timeout(10000);
    try {
      allTypesCommand.run(context)
        .then(function(){
          assert.equal(true,true, 'no exception should be thrown');
          done();
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