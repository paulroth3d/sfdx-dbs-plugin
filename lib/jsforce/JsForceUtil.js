/*jshint esversion: 6*/

const Q = require('q');
const FS = require('fs-extra');
const _ = require('underscore');
const DxConnection = require('../dx/DxConnection');

/**
 * Supporting wrapper around the jsForce utility class.
 * 
 * @class JsForceUtil
 */
class JsForceUtil {

  /**
   * Lists all the metadata api types for a connection
   * 
   * @param {DxConnection} dxConn 
   * @memberof JsForceUtil
   */
  getAllTypes(dxConn){
    const deferred = Q.defer();
    
    //console.log('attempt to get all metadata types'); debugger;

    dxConn.getConnection().metadata.describe( dxConn.apiVersion, function(err, metadata){
      if (err){
        deferred.reject('Error occurred during describe', err);
        return;
      }
      
      deferred.resolve(metadata);
    });

    return (deferred.promise);
  }

  /**
   * Lists all metadata members for a given type.
   * <p>See: https://jsforce.github.io/document/#list-metadata</p>
   * 
   * @param {DxConnection} dxConn 
   * @param {string} type 
   * @param {string} folder 
   * @returns {q.promise} - jsForce listMetadata results
   * @memberof JsForceUtil
   */
  getTypeMembers(dxConn, type, folder){
    const deferred = Q.defer();

    if (!folder){
      folder = '';
    }

    let queryObj = {
      'type': type,
      'folder': folder
    };

    dxConn.getConnection().metadata.list(queryObj, dxConn.apiVersion, function(err, metadata){
      if (err){
        deferred.reject('Error while retrieving members for type:' + type, err);
        return;
      }

      deferred.resolve(metadata);
    });

    return (deferred.promise);
  }

  /**
   * Determines and sorts the types to a printable format.
   * 
   * @param {any} jsForceAllTypeResults - collection of jsForce metadata API list results.
   * @return {q.promise} - promise(string[]) - collection of names
   * @memberof JsForceUtil
   */
  printAllTypeNames(jsForceAllTypeResults){
    const deferred = Q.defer();

    let metadataTypes = jsForceAllTypeResults.metadataObjects;
    let metadataType;

    let metadataNames = [];
    let metadataName;

    for (var i = 0; i < metadataTypes.length; i++){
      metadataType = metadataTypes[i];
      metadataName = metadataType.xmlName;
      if (metadataType.inFolder){
        metadataName += '*';
      }
      metadataNames.push(metadataName);
    }

    //-- sort
    const sortedNames = _.sortBy(metadataNames, function(metadataName){
      return(metadataName);
    });

    for (var j = 0; j < sortedNames.length; j++){
      console.log(sortedNames[j]);
    }

    deferred.resolve(sortedNames);
  }
  /**
   * Determines and sorts the types to a printable format.
   * 
   * @param {any} jsForceAllTypeResults - collection of jsForce metadata API list results.
   * @return {q.promise} - promise(string[]) - collection of names
   * @memberof JsForceUtil
   */

  /**
   * Determines and sorts the members to a printable format.
   * 
   * @param {any} typeMembers - collection of jsForce metadata API list results.
   * @return {q.promise} - promise(string[]) - collection of names
   * @memberof JsForceUtil
   */
  printMemberNames(typeMembers){
    const deferred = Q.defer();

    const results = [];

    let metadataType;
    let metadataTypeName;

    let metadataTypeNames = [];

    if (!typeMembers || typeMembers.length < 1){
      deferred.resolve(results);
      return (deferred.promise);
    }

    for (var i = 0; i < typeMembers.length; i++){
      metadataType = typeMembers[i];
      metadataTypeName = metadataType.fullName;
      metadataTypeNames.push(metadataTypeName);
    }

    //-- sort
    const sortedNames = _.sortBy(metadataTypeNames, function(metadataName){
      return (metadataName);
    });

    deferred.resolve(sortedNames);

    return (deferred.promise);
  }
}

module.exports = new JsForceUtil();