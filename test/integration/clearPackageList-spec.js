/*eslint quotes: ['error', 'single']*/

let _ = require('underscore');
let assert = require('assert');
let fs = require('fs-extra');

const PackageListWriter = require('../../lib/package/modify/PackageListWriter');
const ClearPackageListCommand = require('../../commands/packageList/packageList_clear');

const targetPackageList = 'testAssets/packageLists/testPackageList.txt';
const context = {'topic':null,'command':{'topic':'packageList','command':'clear','plugin':'sfdx-dbs-plugin','namespace':'dbs','usage':'','description':'Clears a given packageList','default':false,'help':'Clears a given packageList','fullHelp':'','hidden':false,'variableArgs':false,'disableAnalytics':false,'args':null,'flags':[{'name':'target','char':'t','description':'Target List to clear','hasValue':true,'hidden':false,'required':false}]},'app':'','args':{},'flags':{'target':targetPackageList},'cwd':'/Users/proth/Documents/work/tools/sfdx-dbs-plugin','herokuDir':'/Users/proth/.cache/sfdx','debug':false,'debugHeaders':false,'dev':true,'supportsColor':true,'version':'sfdx-cli/5.7.7-94c4196 (darwin-amd64) go1.7.5 sfdx-dbs-plugin/0.0.1 node-v6.9.5','apiToken':'','apiHost':'api.heroku.com','apiUrl':'https://api.heroku.com','gitHost':'heroku.com','httpGitHost':'git.heroku.com'};

//-- @TODO: do more than just poor man's integration test

describe('packageList/clear', function(done){
  
  it('runs command', function(done){
    this.timeout(10000);

    try {
      PackageListWriter.writeToPackageList('#description of when written\nclasses/SomeClass', targetPackageList)
        .then(function(){
          return ClearPackageListCommand.run(context);
        })
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