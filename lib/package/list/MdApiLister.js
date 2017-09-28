/*jshint esversion: 6*/

const Q = require('q');
const FS = require('fs-extra');
const _ = require('underscore');
const DxConnection = require('../../dx/DxConnection');

/**
 * Class that lists various aspects from the Metadata API
 * 
 * @class MdApiLister
 */
class MdApiLister {

  /**
   * Lists all the metadata api types for a connection
   * 
   * @param {DxConnection} dxConn 
   * @memberof MdApiLister
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
}

module.exports = new MdApiLister();