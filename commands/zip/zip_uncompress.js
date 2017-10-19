/*jshint esversion: 6*/

const _ = require('underscore');
const Q = require('q');
const FS = require('fs-extra');
const OS = require('os');
const COMPRESS = require('compressing');
const PATH = require('path');
const PackageListAlgebra = require('../../lib/package/modify/PackageListAlgebra');
const MdApiPackage = require('../../lib/package/MdApiPackage.js');
const DxConnection = require('../../lib/dx/DxConnection');
const JsForceUtil = require('../../lib/jsforce/JsForceUtil');

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

  if (!config.target){
    const pathResults = PATH.parse(config.source);
    config.target = pathResults.dir;
  }

  return (config);
}

/**
 * Unzips a file at source path and puts them in targetPath
 * 
 * @param {string} sourceFile - path to the directory to unzip to
 * @param {string} targetDir - path to the directory to unzip to
 * @returns 
 */
function unzipFile(sourceFile, targetDir){
  const deferred = Q.defer();

  console.log('Attempting to unzip:' + sourceFile + '\n');

  FS.pathExists(sourceFile)
    .then(function(exists){
      if(!exists){
        deferred.reject('Could not find source zip:' + sourceFile);
        return;
      }

      return FS.ensureDir(targetDir);
    })
    .then(function(targetExists){
      try {
        COMPRESS.zip.uncompress(sourceFile, targetDir)
          .then(function(uncompressDone){
            deferred.resolve(uncompressDone);
          })
          .catch(function(err){
            console.error(JSON.stringify(err));
            deferred.reject('error occurred while uncompressing file:' + sourceFile);
          });
      } catch(err){
        console.error(JSON.stringify(err));
        deferred.reject('error occurred while uncompressing file:' + sourceFile);
      }
    })
    .catch(function(err){
      deferred.reject('Error occurred while finding source zip:' + sourceFile);
    });

  return deferred.promise;
}

/**
 *  module
 *  @author Paul Roth <proth@salesforce.com>
**/
(function (){
  'use strict';
  
  module.exports = {
    topic: 'zip',
    command: 'uncompress',
    description: 'Uncompresses a zip file',
    help: 'Uncompresses a zip file',
    flags: [{
      name: 'source',
      char: 's',
      description: 'source zip file',
      hasValue: true
    },{
      name: 'target',
      char: 't',
      description: 'Directory to uncompress the results in (default to same as zip)',
      hasValue: true
    },{
      name: 'removeSource',
      char: 'r',
      description: 'On successful unzip, remove the source file if this flag is sent'
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

      unzipFile(context.source, context.target)
        .then(function(compressResolved){
          if (context.removeSource){
            return FS.remove(context.source);
          } else {
            return false;
          }
        })
        .then(function(wasSourceRemoved){
          console.log('successfully uncompressed:' + context.source + '\n' +
            'to:' + context.target );
        })
        .catch(function(errObj){
          if (_.isString(errObj)){
            console.error(errObj);
          } else if (errObj){
            console.error(JSON.stringify(errObj, null, 2));
          }
          deferred.reject(errObj);
        });
      
      return (deferred.promise);
    }
  };
}());