/*eslint quotes: ["error", "double"]*/
/*jshint esversion: 6, quotmark: double */

let _ = require("underscore");
let logModule = require("../commands/log/latest");
let assert = require("assert");
let fs = require("fs-extra");

let exampleContext = {"topic":null,"command":{"topic":"log","command":"latest","plugin":"sfdx-dbs-plugin","namespace":"dbs","usage":"","description":"Reports on the latest cli JSON log","default":false,"help":"See here for more information: https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_cli_log_messages.htm","fullHelp":"","hidden":false,"variableArgs":false,"disableAnalytics":false,"args":null,"flags":[{"name":"format","char":"f","description":"Format for output: json (default) or table","hasValue":true,"hidden":false,"required":false}]},"app":"","args":{},"flags":{},"cwd":"/Users/proth/Documents/work/tools/timeLoggerDX","herokuDir":"/Users/proth/.cache/sfdx","debug":false,"debugHeaders":false,"dev":true,"supportsColor":true,"version":"sfdx-cli/5.7.6-d42cf65 (darwin-amd64) go1.7.3 sfdx-dbs-plugin/0.0.1 node-v6.9.5","apiToken":"","apiHost":"api.heroku.com","apiUrl":"https://api.heroku.com","gitHost":"heroku.com","httpGitHost":"git.heroku.com"};
//let exampleBadLine = '{"name":"sfdx","hostname":"proth-ltm8.internal.salesforce.com","pid":9310,"level":50,"msg":"[ false,\\n  \'{\\"message\\":\\"This org appears to have a problem with its OAuth configuration. Reason: invalid_grant - user hasn\\\\\'t approved this consumer \\\\\\\\nusername: test-p91pncs56pxz@proth_company.net, \\\\\\\\nclientId: 3MVG97wqanbUM37LSlop7R.VNYVxo7C.jrDFn2UvbSRngVh5AX_ZUzrQO2gDcDNUI.8uKUF7Owr5Ll8N00a.o, \\\\\\\\nloginUrl: https://login.salesforce.com, \\\\\\\\nprivateKey: server.key\\",\\"status\\":1,\\"name\\":\\"oauthInvalidGrant\\",\\"warnings\\":[],\\"action\\":\\"Verify the OAuth configuration for this org. For JWT:\\\\\\\\nEnsure the private key is correct and the cert associated with the connected app has not expired.\\\\\\\\nEnsure the following OAuth scopes are configured [api, refresh_token, offline_access].\\\\\\\\nEnsure the username is assigned to a profile or perm set associated with the connected app.\\\\\\\\nEnsure the connected app is configured to pre-authorize admins.\\"}\' ]","time":"2017-09-12T14:14:37.476Z","v":0}';

let exampleLine1 = "{\"name\":\"sfdx\",\"hostname\":\"proth-ltm8.internal.salesforce.com\",\"pid\":9310,\"level\":50,\"msg\":\"[ false,\\n  '{\\\"message\\\":\\\"This org appears to have a problem with its OAuth configuration. Reason: invalid_grant - user hasn\\\\'t approved this consumer \\\\\\\\nusername: test-p91pncs56pxz@proth_company.net, \\\\\\\\nclientId: 3MVG97wqanbUM37LSlop7R.VNYVxo7C.jrDFn2UvbSRngVh5AX_ZUzrQO2gDcDNUI.8uKUF7Owr5Ll8N00a.o, \\\\\\\\nloginUrl: https://login.salesforce.com, \\\\\\\\nprivateKey: server.key\\\",\\\"status\\\":1,\\\"name\\\":\\\"oauthInvalidGrant\\\",\\\"warnings\\\":[],\\\"action\\\":\\\"Verify the OAuth configuration for this org. For JWT:\\\\\\\\nEnsure the private key is correct and the cert associated with the connected app has not expired.\\\\\\\\nEnsure the following OAuth scopes are configured [api, refresh_token, offline_access].\\\\\\\\nEnsure the username is assigned to a profile or perm set associated with the connected app.\\\\\\\\nEnsure the connected app is configured to pre-authorize admins.\\\"}' ]\",\"time\":\"2017-09-12T14:14:37.476Z\",\"v\":0}";
let exampleLine2 = "{\"name\":\"sfdx\",\"hostname\":\"proth-ltm8.internal.salesforce.com\",\"pid\":15874,\"log\":\"jsforce\",\"level\":50,\"msg\":\"{\\\"code\\\":\\\"ENOTFOUND\\\",\\\"errno\\\":\\\"ENOTFOUND\\\",\\\"syscall\\\":\\\"getaddrinfo\\\",\\\"hostname\\\":\\\"proth-dxcli.my.salesforce.com\\\",\\\"host\\\":\\\"proth-dxcli.my.salesforce.com\\\",\\\"port\\\":443}\",\"time\":\"2017-09-13T14:28:59.774Z\",\"v\":0}";
  

describe("Command/Log", function(){
  
  it("provides home directory", function(){
    let badHerokuConfig = {};
    
    try {
      let results = logModule.getHomeLog(badHerokuConfig);
      assert.equal(true, false, "exception should have been thrown");
    } catch(err){
      assert.equal(true, true, "exception correctly thrown if context is unexpected");
    }
  });
  
  it("can find home directory if provided", function(){
    //-- @TODO: support deep clone
    let myContext = exampleContext;
    
    let expected = "/Users/proth/.sfdx/sfdx.log";
    let results = logModule.getHomeLog(exampleContext);
    assert.equal(expected,results,"The home log should match");
  });
  
  //-- i"m not sure how to get the last line of file.
  it("can find the current log", function(done){
    //-- @TODO: figure out a way to test this better on a non *nix machine.
    //-- there is no tmp directory.
    
    logModule.getLastLineOfFile(logModule.getHomeLog(exampleContext))
      .then(function(lastLine){
        console.log("last line"); console.log(JSON.stringify(lastLine));
        assert.notEqual(lastLine, null, "there should be a last line");
        done();
      }).catch(function(err,msg){
        assert.equals(false, true, "Exception occurred while testing last lines");
        done();
      });
  });
  
  it("can understand example line 1", function(done){
    logModule.getMessageContext(JSON.parse(exampleLine1))
      .then(function(context,lastLineMsg){
        assert.equals(true, true, "found the context");
        console.log("lastLineMsg");console.log(JSON.stringify(lastLineMsg, null, 2));
        done();
      })
      .catch(function(err){
        assert.equals(false, true, "We should be able to read all lines");
        done();
      });
    done();
  });
  
  it("can understand example line 2", function(done){
    logModule.getMessageContext(JSON.parse(exampleLine2))
      .then(function(context,lastLineMsg){
        assert.equals(true, true, "found the context");
        console.log("lastLineMsg");console.log(JSON.stringify(lastLineMsg, null, 2));
        done();
      })
      .catch(function(err){
        assert.equals(false, true, "We should be able to read all lines");
        done();
      });
    done();
  });
});