/*jshint esversion: 6*/

const _ = require('underscore');
const Q = require('q');
const PackageListAlgebra = require('../../lib/package/modify/PackageListAlgebra');
const MdApiPackage = require('../../lib/package/MdApiPackage');
const PackageConverter = require('../../lib/package/convert/PackageConverter');
const PackageWriter = require('../../lib/package/modify/PackageWriter');
const DxConnection = require('../../lib/dx/DxConnection');
const JsForceUtil = require('../../lib/jsforce/JsForceUtil');

/**
* Cleans the request and defaults as needed.
* 
* @param {any} config 
* @returns {any}
*/
function cleanContext(config){

  if (config.flags){
    config = config.flags;
  }

  config = _.defaults(config, {
    apiVersion: MdApiPackage.DEFAULT_API_VERSION
  });

  if (!config.targetPath){
    throw('--targetPath is required');
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
    command: 'blank',
    description: 'Creates a blank package',
    help: 'Creates a blank package',
    flags: [{
      name: 'targetPath',
      char: 't',
      description: 'Path for the resulting package (xml) file',
      hasValue: true
    },{
      name: 'apiVersion',
      char: 'a',
      description: 'api version for the package, DEF:' + MdApiPackage.DEFAULT_API_VERSION,
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

      const blankPackage = new MdApiPackage(context.apiVersion);
      const targetPath = context.targetPath;

      PackageConverter.convertPackageJsonToPackage(blankPackage)
        .then(function(xmlWriter){
          return (PackageWriter.writeXmlToFile(xmlWriter, targetPath));
        })
        .then(function(packageWriterResults){
          console.log('finished writing to:' + targetPath);
          deferred.resolve(true);
        })
        .catch(function(err){
          deferred.reject('Error occurred while trying to read:' + targetPath);
        });
      
      return (deferred.promise);
    }
  };
}());