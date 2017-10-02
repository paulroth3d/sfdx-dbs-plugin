/*jshint esversion: 6*/

const _ = require('underscore');
const Q = require('q');
const PROMPT = require('prompt');

const PackageListAlgebra = require('../../lib/package/modify/PackageListAlgebra');
const MdApiPackage = require('../../lib/package/MdApiPackage.js');
const DxConnection = require('../../lib/dx/DxConnection');
const JsForceUtil = require('../../lib/jsforce/JsForceUtil');

const ALL_TYPES_PROMPT_SCHEMA = {
  properties: {
    type: {
      message: 'Which metadata type would you like to list files for?',
      required: true
    }
  }
};

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

  if (!config.type){
    console.log('--type was not provided. To bypass the following list of types/prompt, supply the --type parameter.\n');
    console.log('... determining list of possible Apex Types');
  }

  return (config);
}

/**
 * Determines the Metadata Type to investigate
 * 
 * @param {DxConnection} dxConnection 
 * @param {any} config 
 */
function getMetadataType(dxConnection, config){
  const deferred = Q.defer();

  if (config.type){
    deferred.resolve(config.type);
  } else {
    //-- list all types and then ask about which one we want
    JsForceUtil.getAllTypes(dxConnection)
      .then(function(allTypesResults){
        return (JsForceUtil.printAllTypeNames(allTypesResults));
      })
      .then(function(allTypeEntries){
        for (var i = 0; i < allTypeEntries; i++){
          console.log(allTypeEntries[i]);
        }

        console.log('\n\n\n');

        PROMPT.get(ALL_TYPES_PROMPT_SCHEMA, function(err, result){
          if (err){
            deferred.reject('error occurred while asking for Metadata Types');
          } else {
            deferred.resolve(result.type);
          }
        });
      })
      .catch(function(errStr, errObj){
        deferred.reject(errStr);
      });
  }

  return (deferred.promise);
}

/**
 *  module
 *  @author Paul Roth <proth@salesforce.com>
**/
(function (){
  'use strict';
  
  module.exports = {
    topic: 'list',
    command: 'fromOrg',
    description: 'Lists metadata from Org',
    help: 'Lists metadata from Org',
    flags: [{
      name: 'alias',
      char: 'a',
      description: 'Connection alias',
      hasValue: true
    },{
      name: 'type',
      char: 'y',
      description: 'Metadata API Type (do not specify to list all)',
      hasValue: true
    },{
      name: 'folder',
      char: 'f',
      description: 'Folder within the type to search (only needed for Folder/* types)',
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
          return (getMetadataType(dxConnection, context));
        })
        .then(function(metadataType){
          return (JsForceUtil.getTypeMembers(dxConnection, metadataType, context.folder));
        })
        .then(function(typeMembers){
          return (JsForceUtil.printMemberNames(typeMembers));
        })
        .then(function(memberNames){
          if (!memberNames || memberNames.length < 1){
            console.log('--No Members found--');
          } else {
            for (var j = 0; j < memberNames.length; j++){
              console.log(memberNames[j]);
            }
          }
          deferred.resolve(memberNames);
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