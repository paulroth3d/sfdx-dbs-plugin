/*jshint esversion: 6*/

const _ = require('underscore');
const Q = require('q');
const PackageListAlgebra = require('../../lib/package/modify/PackageListAlgebra');
const MdApiPackage = require('../../lib/mdapi/MdApiPackage.js');

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

  if (!config.source){
    throw('--source is required');
  }

  if (!config.type){
    throw('--type is required');
  }

  if (!config.member){
    throw('--member is required');
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
    command: 'addManual',
    description: 'Manually adds an item to a packageList',
    help: 'Manually adds an item to a packageList',
    flags: [{
      name: 'source',
      char: 's',
      description: 'Relative path to the packageList to modify',
      hasValue: true
    },{
      name: 'type',
      char: 'y',
      description: 'The Metadata API type of the member',
      hasValue: true
    },{
      name: 'member',
      char: 'm',
      description: 'The (optional path) and name of the member to add',
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

      PackageListAlgebra.addMemberManual(context.source, context.type, context.member)
        .then(function(targetPath){
          console.log('Package list updated: ' + targetPath);
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