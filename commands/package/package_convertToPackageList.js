/*jshint esversion: 6*/

const _ = require('underscore');
const Q = require('q');
const PackageListAlgebra = require('../../lib/package/modify/PackageListAlgebra');
const MdApiPackage = require('../../lib/package/MdApiPackage.js');
const PackageConverter = require('../../lib/package/convert/PackageConverter');
const PackageListConverter = require('../../lib/package/convert/PackageListConverter');
const PackageListWriter = require('../../lib/package/modify/PackageListWriter');

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

  //-- @TODO: use a prompt if the target is not specified.
  if (!config.target){
    throw('--target is required');
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
    topic: 'package',
    command: 'convertToPackageList',
    description: 'Converts a metadata package to PackageList format.',
    help: 'Converts a metadata package to PackageList format.',
    flags: [{
      name: 'source',
      char: 's',
      description: 'Source package.xml file',
      hasValue: true
    },{
      name: 'target',
      char: 't',
      description: 'Target packageList file',
      hasValue: true
    }],

    cleanContext: cleanContext,
    
    /**
     * Actual execution of the command
     * @param {SalesforceDXContext} context 
     */
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

      const targetPath = context.target;
      const packageListWriter2 = PackageListWriter;

      PackageConverter.convertPackageToMdApiPackage(context.source)
        .then(function(mdApiPackage){
          return PackageListWriter.writeMdApiPackageToPackageList(mdApiPackage, context.target);
        })
        .then(function(targetPath){
          console.log('finished writing to:' + targetPath);
          deferred.resolve(targetPath);
        })
        .catch(function(errObj){
          console.error('--Error occurred while trying to convert Package to Package List');
          console.error(JSON.stringify(errObj, null, 2));
          deferred.reject(errObj);
        });
      
      return (deferred.promise);
    }
  };
}());