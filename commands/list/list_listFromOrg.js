/*jshint esversion: 6*/

const _ = require('underscore');
const Q = require('q');

const PackageListAlgebra = require('../../lib/package/modify/PackageListAlgebra');
const MdApiPackage = require('../../lib/package/MdApiPackage.js');
const DxConnection = require('../../lib/dx/DxConnection');
const JsForceUtil = require('../../lib/jsforce/JsForceUtil');
const MdApiPrompter = require('../../lib/prompt/MdApiPrompter');
const MdApiPrinter = require('../../lib/package/MdApiPrinter');


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

      //-- uncomment to refresh context for integration tests
      //console.log(JSON.stringify(context)); return deferred.promise;

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
          return (MdApiPrompter.demandType(dxConnection, context.type, '-t|--type [[typeName]]'));
        })
        .then(function(metadataType){
          return (JsForceUtil.getTypeMembers(dxConnection, metadataType, context.folder));
        })
        .then(function(typeMembers){
          return (JsForceUtil.printMemberNames(typeMembers));
        })
        .then(function(memberNames){
          MdApiPrinter.sortAndPrintList(memberNames, '-- no members found --');
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