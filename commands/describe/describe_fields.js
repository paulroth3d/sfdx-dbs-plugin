/*jshint esversion: 6*/

const _ = require('underscore');
const Q = require('q');
const DxConnection = require('../../lib/dx/DxConnection');
const JsForceUtil = require('../../lib/jsforce/JsForceUtil');
const MdApiPrompter = require('../../lib/prompt/MdApiPrompter');
const SchemaUtil = require('../../lib/schema/SchemaUtil');

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

  //-- @TODO: work to allow listing sobjects if the object name is not provided
  //if (!config.sobject){
  //  throw('--sobject is required');
  //}

  return (config);
}

/**
 *  module
 *  @author Paul Roth <proth@salesforce.com>
**/
(function (){
  'use strict';
  
  module.exports = {
    topic: 'describe',
    command: 'fields',
    description: 'Describes the fields for a Salesforce SObject',
    help: 'Lists the objects fields for a Salesforce SObject',
    flags: [{
      name: 'alias',
      char: 'a',
      description: 'Connection alias',
      hasValue: true
    },{
      name: 'sobject',
      char: 'o',
      description: 'API name of the SObject to describe',
      hasValue: true
    },{
      name: 'sortFieldsBy',
      char: 's',
      description: 'column name to sort the field results by',
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
      var sObjectDescr;

      dxConnection.refreshConnection(context.alias)
        .then(function(jsForce){
          //console.log('connection established');
          return (MdApiPrompter.demandSObject(dxConnection, context.sobject, '-o|--sobject [[sobject api name]]'));
        })
        .then(function(sObjectName){
          //-- @TODO: use the sobject name to get the description
          return SchemaUtil.getSObjectDescription(dxConnection, sObjectName);
        })
        .then(function(sObjectDescription){
          sObjectDescr = sObjectDescription;
          return SchemaUtil.printSObjectFields(sObjectDescription, context.sortFieldsBy);
        })
        .then(function(results){
          //debugger;
          deferred.resolve(sObjectDescr);
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