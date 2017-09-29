/*eslint quotes: ['error', 'single']*/

let _ = require('underscore');
let assert = require('assert');
let fs = require('fs-extra');

const addMemberManual = require('../../commands/packageList/packageList_addManual');

const targetPackageList = 'testAssets/packageLists/testPackageList.txt';
const context = {'topic':null,'command':{'topic':'packageList','command':'addManual','plugin':'sfdx-dbs-plugin','namespace':'dbs','usage':'','description':'Manually adds an item to a packageList','default':false,'help':'Manually adds an item to a packageList','fullHelp':'','hidden':false,'variableArgs':false,'disableAnalytics':false,'args':null,'flags':[{'name':'source','char':'s','description':'Relative path to the packageList to modify','hasValue':true,'hidden':false,'required':false},{'name':'type','char':'y','description':'The Metadata API type of the member','hasValue':true,'hidden':false,'required':false},{'name':'member','char':'m','description':'The (optional path) and name of the member to add','hasValue':true,'hidden':false,'required':false}]},'app':'','args':{},'flags':{'member':'SomeClass','source':targetPackageList,'type':'ApexClass'},'cwd':'/Users/proth/Documents/work/tools/sfdx-dbs-plugin','herokuDir':'/Users/proth/.cache/sfdx','debug':false,'debugHeaders':false,'dev':true,'supportsColor':true,'version':'sfdx-cli/5.7.7-94c4196 (darwin-amd64) go1.7.5 sfdx-dbs-plugin/0.0.1 node-v6.9.5','apiToken':'','apiHost':'api.heroku.com','apiUrl':'https://api.heroku.com','gitHost':'heroku.com','httpGitHost':'git.heroku.com'};

//-- @TODO: do more than just poor man's integration test

describe('packageList/addManual', function(done){
  
  it('runs command', function(done){
    this.timeout(10000);
    try {
      addMemberManual.run(context)
        .then(function(){
          assert.equal(true,true, 'no exception should be thrown');
          fs.remove(targetPackageList, function(err){
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