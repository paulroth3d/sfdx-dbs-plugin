/*jshint esversion: 6*/

const Q = require('q');
const FS = require('fs-extra');
const PATH = require('path');
const _ = require('underscore');
const MdApiPackage = require('../MdApiPackage');
const PackageListConverter = require('../convert/PackageListConverter');
const MdApiPackageMember = MdApiPackage.member;
const MdApiPackageType = MdApiPackage.type;
const MdApiPackageUtil = require('../../package/MdApiPackageUtil');
const PackageListWriter = require('./PackageListWriter');
const OS = require('os');

/**
 * Logic that supports basic algebra on PackageLists.
 * (Unions, Subtractions, Adding Lines, etc)
 * 
 * @class PackageListAlgebra
 */
class PackageListAlgebra {

  /**
   * Clears a package list at a given path
   * 
   * @param {string} targetPath 
   * @returns {q.promise}
   * @memberof PackageListAlgebra
   */
  clearPackageList(targetPath){
    const deferred = Q.defer();

    PackageListWriter.writeToPackageList('', targetPath)
      .then(function(targetPath){
        deferred.resolve(targetPath);
      })
      .catch(function(errMsg, err){
        deferred.reject(errMsg, err);
      });

    return deferred.promise;
  }

  /**
   * Manually adds an item to a packageList
   * 
   * @param {string} targetPath - relative path to the packageList to use as source
   * @param {string} type - type from the Metadata API
   * @param {string} member - (optional path) and name of Member
   * @memberof PackageListAlgebra
   */
  addMemberManual(targetPath, type, member){
    const deferred = Q.defer();

    const folderType = MdApiPackageUtil.convertMetaToFolder(type);
    if (!folderType){
      deferred.reject('Could not convert Metadata API Type[' + type + '] - run list metadata for more options');
    }
    const fileExtension = MdApiPackageUtil.convertMetaToExtension(type);
    const lineToAdd = '' + folderType + PATH.sep + member + fileExtension + OS.EOL;

    PackageListWriter.appendToPackageList(lineToAdd, targetPath)
      .then(function(targetPath){
        deferred.resolve(targetPath);
      })
      .catch(function(errMsg, err){
        deferred.reject(errMsg, err);
      });

    return (deferred.promise);
  }

  /**
   * Adds a collection of members to a packageList
   * 
   * @param {string} targetPath 
   * @param {MdApiPackageMember[]} members 
   * @return {q.promise} - promise(targetPath)
   * @memberof PackageListAlgebra
   */
  addPackageMembers(targetPath, apiMembers){
    const deferred = Q.defer();

    PackageListConverter.convertMdApiMembersToPackageListLines(apiMembers)
      .then(function(packageListLines){
        const newLines = OS.EOL + packageListLines.join(OS.EOL) + OS.EOL;
        return(PackageListWriter.appendToPackageList(newLines, targetPath));
      })
      .then(function(targetPath){
        deferred.resolve(targetPath);
      })
      .catch(function(errMsg, errObj){
        deferred.reject(errMsg, errObj);
      });

    return (deferred.promise);
  }
}

module.exports = new PackageListAlgebra();
