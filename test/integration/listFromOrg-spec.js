/*eslint quotes: ['error', 'single']*/

let _ = require('underscore');
let assert = require('assert');
let fs = require('fs-extra');

const command = require('../../commands/list/list_listFromOrg');

//-- move JSON.stringify(context) here
const targetOrg='lightningSupport';
const contextAskingForClasses = {'topic':null,'command':{'topic':'list','command':'fromOrg','plugin':'sfdx-dbs-plugin','namespace':'dbs','usage':'','description':'Lists metadata from Org','default':false,'help':'Lists metadata from Org','fullHelp':'','hidden':false,'variableArgs':false,'disableAnalytics':false,'args':null,'flags':[{'name':'alias','char':'a','description':'Connection alias','hasValue':true,'hidden':false,'required':false},{'name':'type','char':'y','description':'Metadata API Type (do not specify to list all)','hasValue':true,'hidden':false,'required':false},{'name':'folder','char':'f','description':'Folder within the type to search (only needed for Folder/* types)','hasValue':true,'hidden':false,'required':false}]},'app':'','args':{},'flags':{'alias':targetOrg,'type':'ApexPage'},'cwd':'/Users/proth/Documents/work/tools/sfdx-dbs-plugin','herokuDir':'/Users/proth/.cache/sfdx','debug':false,'debugHeaders':false,'dev':true,'supportsColor':true,'version':'sfdx-cli/5.7.7-94c4196 (darwin-amd64) go1.7.5 sfdx-dbs-plugin/0.0.1 node-v6.9.5','apiToken':'','apiHost':'api.heroku.com','apiUrl':'https://api.heroku.com','gitHost':'heroku.com','httpGitHost':'git.heroku.com'};
const contextAskingForTypes = {'topic':null,'command':{'topic':'list','command':'fromOrg','plugin':'sfdx-dbs-plugin','namespace':'dbs','usage':'','description':'Lists metadata from Org','default':false,'help':'Lists metadata from Org','fullHelp':'','hidden':false,'variableArgs':false,'disableAnalytics':false,'args':null,'flags':[{'name':'alias','char':'a','description':'Connection alias','hasValue':true,'hidden':false,'required':false},{'name':'type','char':'y','description':'Metadata API Type (do not specify to list all)','hasValue':true,'hidden':false,'required':false},{'name':'folder','char':'f','description':'Folder within the type to search (only needed for Folder/* types)','hasValue':true,'hidden':false,'required':false}]},'app':'','args':{},'flags':{'alias':targetOrg},'cwd':'/Users/proth/Documents/work/tools/sfdx-dbs-plugin','herokuDir':'/Users/proth/.cache/sfdx','debug':false,'debugHeaders':false,'dev':true,'supportsColor':true,'version':'sfdx-cli/5.7.7-94c4196 (darwin-amd64) go1.7.5 sfdx-dbs-plugin/0.0.1 node-v6.9.5','apiToken':'','apiHost':'api.heroku.com','apiUrl':'https://api.heroku.com','gitHost':'heroku.com','httpGitHost':'git.heroku.com'};

//-- @TODO: do more than just poor man's integration test

describe('list/listFromOrg', function(done){
  
  /*
  //-- uncomment when we know a way to bypass the prompt
  it('listsTypesFromOrg', function(done){
    this.timeout(10000);
    try {
      command.run(contextAskingForTypes)
        .then(function(){
          assert.equal(true,true, 'no exception should be thrown');
          done();
        })
        .catch(function(){
          assert.fail('no exceptions should be thrown when compressing');
          done();
        });
    } catch(err){
      assert.fail('exception happened while running command:' + JSON.stringify(arguments));
    }
  });
  */

  it('listsApexFromOrg', function(done){
    this.timeout(10000);
    try {
      command.run(contextAskingForClasses)
        .then(function(){
          assert.equal(true,true, 'no exception should be thrown');
          done();
        })
        .catch(function(){
          assert.fail('no exceptions should be thrown when compressing');
          done();
        });
    } catch(err){
      assert.fail('exception happened while running command:' + JSON.stringify(arguments));
    }
  });
});