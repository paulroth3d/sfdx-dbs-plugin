
/*eslint quotes: ['error', 'single']*/

let _ = require('underscore');
let assert = require('assert');
let fs = require('fs-extra');

const addFromOrg = require('../../commands/packageList/packageList_addFromOrg');

const targetOrg = process.env.targetOrg || 'lightningSupport';
const memberTypeToAdd = process.env.memberTypeToAdd || 'ApexPage';
const targetPackageList = 'testAssets/packageLists/testPackageList.txt';
const context = {'topic':null,'command':{'topic':'packageList','command':'addTypeFromOrg','plugin':'sfdx-dbs-plugin','namespace':'dbs','usage':'','description':'Adds all items of a given type from the Salesforce Org to a PackageList','default':false,'help':'Adds all items of a given type from the Salesforce Org to a PackageList','fullHelp':'','hidden':false,'variableArgs':false,'disableAnalytics':false,'args':null,'flags':[{'name':'target','char':'s','description':'Relative path of the PackageList to the packageList to modify','hasValue':true,'hidden':false,'required':false},{'name':'alias','char':'a','description':'Connection Alias','hasValue':true,'hidden':false,'required':false},{'name':'type','char':'y','description':'The Metadata API type of the member','hasValue':true,'hidden':false,'required':false}]},'app':'','args':{},'flags':{'alias': targetOrg,'target':targetPackageList,'type':memberTypeToAdd,'bypassConfirmation':'bypassConfirmation'},'cwd':'/Users/proth/Documents/work/tools/sfdx-dbs-plugin','herokuDir':'/Users/proth/.cache/sfdx','debug':false,'debugHeaders':false,'dev':true,'supportsColor':true,'version':'sfdx-cli/5.7.7-94c4196 (darwin-amd64) go1.7.5 sfdx-dbs-plugin/0.0.1 node-v6.9.5','apiToken':'','apiHost':'api.heroku.com','apiUrl':'https://api.heroku.com','gitHost':'heroku.com','httpGitHost':'git.heroku.com'};

//-- @TODO: do more than just poor man's integration test

describe('packageList/addFromOrg', function(done){
  
  it('runs command', function(done){
    this.timeout(10000);
    try {
      addFromOrg.run(context)
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