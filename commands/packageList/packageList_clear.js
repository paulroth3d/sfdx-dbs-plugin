/*jshint esversion: 6*/

const _ = require('underscore');
const Q = require('q');
const PackageListAlgebra = require('../../lib/package/modify/PackageListAlgebra');
const MdApiPackage = require('../../lib/mdapi/MdApiPackage');

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
    apiVersion: MdApiPackage.DEFAULT_API_VERSION
  });

  if (!config.target){
    throw('--target is required');
  }

  return (config);
}

/**
 *  module
 *  @author Paul Roth <proth@salesforce.com>
**/
(function (){
  'use strict';
  
  module.exports = {
    topic: 'packageList',
    command: 'clear',
    description: 'Clears a given packageList',
    help: 'Clears a given packageList',
    flags: [{
      name: 'target',
      char: 't',
      description: 'Target List to clear',
      hasValue: true
    }],

    cleanContext: cleanContext,
    
    run(context){
      const deferred = Q.defer();

      //console.log(JSON.stringify(context));

      try {
        context = cleanContext(context);
      } catch(err){
        console.error(JSON.stringify(err, null, 2));
        deferred.reject(err);
        return (deferred.promise);
      }

      PackageListAlgebra.clearPackageList(context.target)
        .then(function(results){
          console.log('completed writing the package:' + context.target);
        })
        .catch(function(errMsg,errObj){
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