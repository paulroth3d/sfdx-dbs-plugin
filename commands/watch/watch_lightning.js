/*jshint esversion: 6*/
const FS = require('fs-extra');
const LightningLintWatcher = require('../../lib/watch/LightningLintWatcher');
const PATH = require('path');
const Q = require('q');
const _ = require('underscore');

/**
* Cleans the request and defaults as needed.
* 
* @param {any} config 
* @returns 
*/
function cleanContext(config){

  if (config.flags){
    config = config.flags;
  }

  config = _.defaults(config, {
    'dir': 'force-app',
    'runAllOnChange': false
  });

  if (!config.dir){
    throw('--dir: the directory to watch is required');
  }

  return (config);
}

/**
 *  module
 *  @author Paul Roth <proth@salesforce.com>
**/
(function () {
  'use strict';
  
  module.exports = {
    topic: 'watch',
    command: 'lightning',
    description: 'Runs the Salesforce Lightning linter on a local directory',
    help: 'Watches a directory to run the Lightning Linter (using the Salesforce CLI)',
    flags: [{
      name: 'dir',
      char: 'd',
      description: 'Directory to watch',
      hasValue: true
    },{
      name: 'ignorePattern',
      char: 'i',
      description: 'Pattern to use to ignore files',
      hasValue: false
    },{
      name: 'filePattern',
      char: 'f',
      description: 'Pattern to use to look for files',
      hasValue: true
    },{
      name: 'verbose',
      char: 'v',
      description: 'Should the linter run in verbose mode',
      hasValue: false
    },{
      name: 'runAllOnChange',
      char: 'r',
      description: 'Run lint against everything (true) on change, or just lightning component changed (false-default)',
      hasValue: false
    }],
    
    //-- use for testing or move implementation to separate module.

    cleanContext:cleanContext,
    
    run(context){
      const deferred = Q.defer();

      //console.log(JSON.stringify(context)); deferred.resolve(); return deferred.promise;

      try {
        context = cleanContext(context);
      } catch(err){
        console.error(JSON.stringify(err, null, 2));
        deferred.reject(err);
        return (deferred.promise);
      }

      const lintWatcher = new LightningLintWatcher();
      lintWatcher.startWatch(context)
        .then(function(){
          console.info('complete');
        })
        .catch(function(errMsg, errObj){
          if (errMsg){
            console.error(errMsg);
          }
          if (errObj){
            console.error(JSON.stringify(errObj, null, 2));
          }
        });
      
      return (deferred.promise);
    }
  };
}());