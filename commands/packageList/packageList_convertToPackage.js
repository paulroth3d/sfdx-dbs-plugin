/*jshint esversion: 6*/

const _ = require('underscore');
const Q = require('q');
const PackageListConverter = require('../../lib/package/packageList/PackageListConverter');

const DEFAULT_API_VERSION = '40.0';

/**
* Cleans the request and defaults as needed.
* 
* @param {any} config 
* @returns 
*/
function cleanPackageListToXml(config){

  if (config.flags){
    config = config.flags;
  }

  config = _.defaults(config, {
    apiVersion: DEFAULT_API_VERSION
  });

  if (!config.source){
    throw('--source is required');
  }

  if (!config.target){
    config.target = config.source.replace(/\.txt$/gi, '.xml');
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
    command: 'convertToPackage',
    description: 'Converts a packageList to a package',
    help: 'Converts a packageList to a package',
    flags: [{
      name: 'source',
      char: 's',
      description: 'Relative path to the package list to convert',
      hasValue: true
    },{
      name: 'target',
      char: 't',
      description: 'Path for the resulting package (xml) file',
      hasValue: true
    },{
      name: 'apiVersion',
      char: 'a',
      description: 'api version for the package, DEF:' + DEFAULT_API_VERSION,
      hasValue: true
    }],

    cleanContext: cleanPackageListToXml,
    
    run(context){
      const deferred = Q.defer();

      //console.log(JSON.stringify(context));

      try {
        context = cleanPackageListToXml(context);
      } catch(err){
        console.error(JSON.stringify(err, null, 2));
        deferred.reject(err);
        return (deferred.promise);
      }

      PackageListConverter.convertPackageListToXml(context.source, context.target, context.apiVersion)
        .then(function(results){
          console.log('completed writing the package:' + context.target);
        })
        .catch(function(errMsg,errObj){
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