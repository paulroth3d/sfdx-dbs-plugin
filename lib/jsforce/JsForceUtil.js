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
  listAllTypes(dxConn){
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
  listTypeMembers(dxConn, type, folder){
    const deferred = Q.defer();

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
}

module.exports = new JsForceUtil();