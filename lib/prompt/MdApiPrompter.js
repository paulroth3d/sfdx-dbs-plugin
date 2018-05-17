/*jshint esversion: 6*/

const _ = require('underscore');
const Q = require('q');
const PROMPT = require('prompt');
const DxConnection = require('../dx/DxConnection');
const JsForceUtil = require('../jsForce/JsForceUtil');

const ALL_TYPES_PROMPT_SCHEMA = {
  properties: {
    type: {
      message: 'Which metadata type would you like to list files for?',
      required: true
    }
  }
};

const ALL_SOBJECT_PROMPT_SCHEMA = {
  properties: {
    type: {
      message: 'Which SObject would you like to use?',
      required: true
    }
  }
};

/**
 * Prompts for specific information about the metadata API
 * 
 * @class MdApiPrompter
 */
class MdApiPrompter {
  
  /**
   * Requests the type to use - but only if type has not been provided.
   * 
   * @param {DxConnection} dxConnection 
   * @param {string} currentType 
   * @param {string} typeFlagName
   * @memberof MdApiPrompter
   */
  demandType(dxConnection, currentType, typeFlagName){
    const deferred = Q.defer();

    if (currentType){
      //-- lets use that
      deferred.resolve(currentType);
      return (deferred.promise);
    }

    if (!typeFlagName){
      //-- assume we are being consistent, and the flag is '-t|--type [[typeName]];
      typeFlagName = '-t|--type [[typeName]]';
    }

    console.log('--type was not provided. To bypass the following list of types/prompt, supply the ' + typeFlagName + ' parameter.\n');
    console.log('... determining list of possible Apex Types');

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

    return deferred.promise;
  }
  
  /**
   * Requests the sobject to use - but only if sobject has not been provided.
   * 
   * @param {DxConnection} dxConnection 
   * @param {string} currentSObject 
   * @param {string} sobjectFlagName
   * @memberof MdApiPrompter
   */
  demandSObject(dxConnection, currentSObject, sobjectFlagName){
    const deferred = Q.defer();

    if (currentSObject){
      //-- lets use that
      deferred.resolve(currentSObject);
      return (deferred.promise);
    }

    if (!sobjectFlagName){
      //-- assume we are being consistent
      sobjectFlagName = '--o|--sobject [[typeName]]';
    }

    console.log( sobjectFlagName + ' was not provided. To bypass the following list of types/prompt, supply the ' + sobjectFlagName + ' parameter.\n');
    console.log('... determining list of possible SObjects');

    //-- list all types and then ask about which one we want
    JsForceUtil.getTypeMembers(dxConnection, 'CustomObject', null)
      .then(function(allSobjectResults){
        return JsForceUtil.printMemberNames(allSobjectResults);
      })
      .then(function(allSObjectEntries){
        for (var i = 0; i < allSObjectEntries.length; i++){
          console.log(allSObjectEntries[i]);
        }

        console.log('\n\n\n');
        PROMPT.get(ALL_SOBJECT_PROMPT_SCHEMA, function(err, result){
          if (err){
            deferred.reject('error occurred while asking for SObjects');
          } else {
            deferred.resolve(result.type);
          }
        });
      })
      .catch(function(errStr, errObj){
        deferred.reject(errStr);
      });
    
    return deferred.promise;
  }
}

module.exports = new MdApiPrompter();
