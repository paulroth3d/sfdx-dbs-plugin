/*jshint esversion: 6*/

const _ = require('underscore');
const Q = require('q');
const PackageListAlgebra = require('../../lib/package/modify/PackageListAlgebra');
const MdApiPackage = require('../../lib/package/MdApiPackage.js');
const DxConnection = require('../../lib/dx/DxConnection');
const JsForceUtil = require('../../lib/jsforce/JsForceUtil');

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
 *  @author Paul Roth <proth@salesforce.com>
**/
(function (){
  'use strict';
  
  module.exports = {
    topic: 'list',
    command: 'allTypes',
    description: 'Manually adds an item to a packageList',
    help: 'Manually adds an item to a packageList',
    flags: [{
      name: 'alias',
      char: 'a',
      description: 'Connection alias',
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

      const dxConnection = new DxConnection();
      dxConnection.refreshConnection(context.alias)
        .then(function(jsForce){
          //console.log('connection established');
          return (JsForceUtil.getAllTypes(dxConnection));
        })
        .then(function(allTypesResults){
          return (JsForceUtil.printAllTypeNames(allTypesResults));
        })
        .then(function(allTypeNames){
          for (var i = 0; i < allTypeNames; i++){
            console.log(allTypeNames[i]);
          }
          deferred.resolve(allTypeNames);
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