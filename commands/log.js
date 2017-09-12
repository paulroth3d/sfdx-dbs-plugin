/*esversion: 6*/
const fs = require('fs-extra');
const path = require('path');

/**
 *  Module that works with the latest logs of sfdx CLI.
 *  @author Paul Roth <proth@salesforce.com>
**/
(function () {
  'use strict';
  
  /**
   *  Determines the home directory for the current user
   *  based on the context.
   *  @param context (object) - context from the sfdx cli
   *  @return (String) path to the user's home directory;
  **/
  function getHomeLog(context){
    let results = '';
    if( !context || !context.herokuDir ){
      throw('could not find home directory');
    } else {
      results = path.join( context.herokuDir, '..', '..', '.sfdx', 'sfdx.log' );
    }
    return( results );
  }
  
  module.exports = {
    topic: 'log',
    command: 'latest',
    description: 'Reports on the latest cli JSON log',
    help: 'See here for more information: https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_cli_log_messages.htm',
    flags: [{
      name: 'format',
      char: 'f',
      description: 'Format for output: json (default) or table',
      hasValue: true
    }],
    run(context){
      console.log( 'ran the command' );
      //console.log( JSON.stringify(context,null,2) );
      
      let homeLog=getHomeLog(context);
      console.log('homeLog=' + homeLog);
      fs.pathExists(homeLog)
        .then( function(exists){
          console.log('exists');
          console.log(exists);
          console.log(arguments);
        })['catch']( function( err, exists){
          console.log( 'catch' );
          console.log( JSON.stringify(arguments));
        });
    }
  };
}());