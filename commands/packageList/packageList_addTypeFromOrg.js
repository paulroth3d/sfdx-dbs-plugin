/*jshint esversion: 6*/

const _ = require('underscore');
const Q = require('q');
const FS = require('fs-extra');
const DxConnection = require('../../lib/dx/DxConnection');
const JsForceUtil = require('../../lib/jsforce/JsForceUtil');
const MdApiPackageUtil = require('../../lib/package/MdApiPackageUtil');
const PackageListAlgebra = require('../../lib/package/modify/PackageListAlgebra');
const PackageListConverter = require('../../lib/package/convert/PackageListConverter');

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

  if (!config.target){
    throw('--target is required');
  }

  if (!config.type){
    throw('--type is required');
  }

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
    topic: 'packageList',
    command: 'addTypeFromOrg',
    description: 'Adds all items of a given type from the Salesforce Org to a PackageList',
    help: 'Adds all items of a given type from the Salesforce Org to a PackageList',
    flags: [{
      name: 'target',
      char: 't',
      description: 'Relative path of the PackageList to the packageList to modify',
      hasValue: true
    },{
      name: 'alias',
      char: 'a',
      description: 'Connection Alias',
      hasValue: true
    },{
      name: 'type',
      char: 'y',
      description: 'The Metadata API type of the member',
      hasValue: true
    }],

    cleanContext: cleanContext,
    
    run(context){
      const deferred = Q.defer();

      //-- context to create integration tests from
      //console.log(JSON.stringify(context)); deferred.resolve(true); return (deferred.promise);

      try {
        context = cleanContext(context);
      } catch(err){
        console.error(JSON.stringify(err, null, 2));
        deferred.reject(err);
        return (deferred.promise);
      }

      const targetPath = context.target;
      const dxConnection = new DxConnection();
      dxConnection.refreshConnection(context.alias)
        .then(function(jsForce){
          return JsForceUtil.listTypeMembers(dxConnection, context.type, '');
        })
        .then(function(metadata){
          return (MdApiPackageUtil.convertMetadataApiMembers(metadata));
        })
        .then(function(mdApiMembers){
          return (PackageListAlgebra.addPackageMembers(targetPath,mdApiMembers));
        })
        .then(function(targetPath){
          return FS.readFileSync(targetPath, {encoding: 'UTF-8'});
        })
        .then(function(contents){
          console.log('Updated Package List: ' + targetPath + '\n\n\n');
          console.log(contents);
          deferred.resolve(targetPath);
        })
        .catch(function(errMsg,errObj){
          if (errMsg){
            console.error(errMsg);
          }
          if (errObj){
            console.error(JSON.stringify(errObj, null, 2));
          }
          deferred.reject(errMsg, errObj);
        });
      
      return (deferred.promise);
    }
  };
}());