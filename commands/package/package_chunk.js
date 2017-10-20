/*jshint esversion: 6*/

const _ = require('underscore');
const Q = require('q');
const FS = require('fs-extra');
const OS = require('os');
const PATH = require('path');
const PackageListAlgebra = require('../../lib/package/modify/PackageListAlgebra');
const MdApiPackage = require('../../lib/package/MdApiPackage.js');
const MdApiPackageMember = MdApiPackage.member;
const MdApiPackageType = MdApiPackage.type;
const MdApiPackageUtil = require('../../lib/package/MdApiPackageUtil');
const DxConnection = require('../../lib/dx/DxConnection');
const JsForceUtil = require('../../lib/jsforce/JsForceUtil');
const PackageWriter= require('../../lib/package/modify/PackageWriter');

/** separator between the prefix and the index name */
const TARGET_PREFIX_SEP = '_';
const INITIAL_CHUNK_INDEX = 1;
const TARGET_EXTENSION = '.xml';
const DEFAULT_CHUNK_SIZE = 10000;
const DEFAULT_PREFIX = 'package';

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
    chunkSize: DEFAULT_CHUNK_SIZE, //-- as current, you cannot retrieve more than 10 000 members per package
    apiVersion: MdApiPackage.DEFAULT_API_VERSION,
    prefix: DEFAULT_PREFIX
  });

  if (!config.userAlias){
    throw('--userAlias is required');
  }

  if (!config.target){
    throw('--target is required');
  }

  let chunkSizeNum = parseInt(config.chunkSize);
  if (!chunkSizeNum || isNaN(chunkSizeNum)){
    throw('--chunkSize must be an integer');
  }
  config.chunkSize=chunkSizeNum;

  //-- calculate any additional properties
  //-- none right now

  return (config);
}

/**
 * Creates a MdApiPackage[] array with the set of all packages
 * to be chunked.
 * 
 * @param {string} apiVersion - package api version
 * @param {metaDataApiPackage[]} array of package members to be chunked 
 * @param {integer} chunkSize - maximum number of members to be added per package
 * @returns {q.promise<mdApiPackage[],errObj>} - promise with an array of mdApiPackage files
 * @promise mdApiPackage[]
 */
function chunkMembersToPackages(apiVersion, allMembers, chunkSize){
  let allPackages = [];
  let currentPackage;
  let currentMember;
  let memberCount = 0; //-- count is actually added at the type level
  
  if (allMembers && allMembers.length > 0){
    for (var i = 0; i < allMembers.length; i++){
      if (memberCount >= chunkSize){
        allPackages.push(currentPackage);
        currentPackage = null;
        memberCount = 0;
      }
      if (!currentPackage){
        currentPackage = new MdApiPackage(apiVersion);
      }
      currentMember = allMembers[i];
      if (currentMember){
        //-- validate in any way
        currentPackage.addMember(currentMember);
        memberCount++;
      }
    }

    //-- add in the remaining package
    allPackages.push(currentPackage);
  }

  return allPackages;
}

/**
 * Writes all files 
 * 
 * @param {MdApiPackage[]} mdApiPackageArray - array of all the MdApiPackages to write
 * @param {string} filePrefix - filename prefix for each of the packages to write
 * @param {string} target - the directory to write all the packages in
 */
function writeAllPackages(mdApiPackageArray, filePrefix, target){
  const deferred = Q.defer();
  const self = this;

  const allFileNames = [];

  //-- create a serial promise chain for writing each package to a file
  const serialPromisifyWritingPackages = function(mdApiPackagesToIterate){
    let count = INITIAL_CHUNK_INDEX;
    return _.reduce(mdApiPackagesToIterate, function(oldPromise, currentMdApiPackage){
      return oldPromise.then(function(results){
        //-- reduction is held outside
        const targetPath = generatePackagePath(target, filePrefix, count++);
        allFileNames.push(targetPath);
        return PackageWriter.writeMdApiPackageToFile(currentMdApiPackage, targetPath);
      });
    }, Q.when());
  };

  serialPromisifyWritingPackages(mdApiPackageArray)
    .then(function(){
      deferred.resolve(allFileNames);
    })
    .catch(function(errObj){
      deferred.reject(errObj);
    });

  return deferred.promise;
}

/**
 * generates the path for the package to be generated.
 * 
 * @param {string} targetDir - path to the target directory
 * @param {string} targetPrefix - string file prefix
 * @param {integer} index - current index
 * @visiblity private
 * @returns 
 */
function generatePackagePath(targetDir, targetPrefix, index){
  let zeroPadIndex = ('0000' + index).substr(-4,4);
  return (PATH.normalize(targetDir + PATH.sep + targetPrefix + TARGET_PREFIX_SEP + zeroPadIndex + TARGET_EXTENSION ));
}

/**
 *  module
 *  @author Paul Roth <proth@salesforce.com>
**/
(function (){
  'use strict';
  
  module.exports = {
    topic: 'package',
    command: 'chunk',
    description: 'Creates packages for all metadata of a given type, with at most CHUNK members per package',
    help: 'Creates packages for all metadata of a given type, with at most CHUNK members per package',
    flags: [{
      name: 'target',
      char: 't',
      description: 'Target folder to place the resulting files',
      hasValue: true
    },{
      name: 'prefix',
      char: 'p',
      description: 'Prefix for packages generated',
      hasValue: true
    },{
      name: 'chunkSize',
      char: 's',
      description: 'Max number of members per package file',
      hasValue: true
    },{
      name: 'userAlias',
      char: 'u',
      description: 'Connection Alias to pull against',
      hasValue: true
    },{
      name: 'apiVersion',
      char: 'a',
      description: 'API version to use',
      hasValue: true,
      default: '40.0'
    },{
      name: 'folderType',
      char: 'f',
      description: 'Metadata API type for folders (ex: DocumentFolder, EmailFolder, etc)',
      hasValue: true
    },{
      name: 'memberType',
      char: 'm',
      description: 'Metadata API type for the documents (within those folders)',
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

      const dxConnection = new DxConnection(context.apiVersion);
      dxConnection.refreshConnection(context.userAlias)
        .then(function(jsForce){
          //-- get all members for the folder
          return JsForceUtil.getTypeFolderMembers(dxConnection, context.folderType, context.memberType);
        })
        .then(function(allMembers){
          //-- conver the metadata API results to MdApiPackageMember objects
          return MdApiPackageUtil.convertMetadataApiMembers(allMembers);
        })
        .then(function(allMdApiPackageMembers){
          //-- create packages with CHUNK max number of members
          return chunkMembersToPackages(context.apiVersion, allMdApiPackageMembers, context.chunkSize);
        })
        .then(function(packageArray){
          return writeAllPackages(packageArray, context.prefix, context.target);
        })
        .then(function(packageFilePathArray){
          console.log('The following package files have been generated:');
          _.each(packageFilePathArray, function(packagePath){
            console.log(packagePath);
          });
          deferred.resolve(packageFilePathArray);
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