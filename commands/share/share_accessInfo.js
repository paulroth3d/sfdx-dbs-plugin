/*jshint esversion: 6*/
const FS = require('fs-extra');
const PATH = require('path');
const Q = require('q');
const _ = require('underscore');
//import {SchemaUtil} from '../../lib/share/AccessUtil';
const AccessUtil = require('../../lib/share/AccessUtil').AccessUtil;
const AccessInfo = require('../../lib/share/AccessUtil').AccessInfo;

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
  });

  if (!config.alias){
    throw('--alias is required');
  }

  return (config);
}

/**
 *  module
 *  @author [[firstname lastname]] <email>
**/
(function () {
  'use strict';
  
  module.exports = {
    topic: 'share',
    command: 'accessInfo',
    description: 'Shares access to a scratch org',
    help: 'Provides a login url for a given scratch org',
    flags: [{
      name: 'alias',
      char: 'a',
      description: 'Org Alias to use',
      hasValue: true
    },{
      name: 'json',
      char: 'j',
      description: 'Whether to return the response in json',
      hasValue: false
    }],
    
    //-- use for testing or move implementation to separate module.
    cleanContext: cleanContext,
    
    run(context){
      const deferred = Q.defer();

      //-- uncomment to refresh context for integration tests
      //console.log(JSON.stringify(context)); return deferred.promise;

      try {
        context = cleanContext(context);
      } catch(err){
        console.error(JSON.stringify(err, null, 2));
        deferred.reject(err);
        return (deferred.promise);
      }

      AccessUtil.getAccessInfo(context.alias)
        .then(function(accessInfo){
          if(context.json){
            console.log(JSON.stringify(accessInfo.toJSON()));
          } else {
            console.log(accessInfo.toString());
          }
        })
        .catch(function(err){
          debugger;
          console.error('Error occurred: ' + err);
        });
    }
  };
}());