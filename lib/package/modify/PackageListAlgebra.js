/*jshint esversion: 6*/

const Q = require('q');
const FS = require('fs-extra');
const PATH = require('path');
const _ = require('underscore');
const MdApiPackageUtil = require('../../mdapi/MdApiPackageUtil');
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

    MdApiPackageUtil.writeToPackageList('', targetPath)
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
   * @param {string} sourcePath - relative path to the packageList to use as source
   * @param {string} type - type from the Metadata API
   * @param {string} member - (optional path) and name of Member
   * @memberof PackageListAlgebra
   */
  addMemberManual(sourcePath, type, member){
    const deferred = Q.defer();

    const folderType = MdApiPackageUtil.convertMetaToFolder(type);
    if (!folderType){
      deferred.reject('Could not convert Metadata API Type[' + type + '] - run list metadata for more options');
    }
    const fileExtension = MdApiPackageUtil.convertMetaToExtension(type);
    const lineToAdd = '' + folderType + PATH.sep + member + fileExtension + OS.EOL;

    MdApiPackageUtil.appendToPackageList(lineToAdd, sourcePath)
      .then(function(targetPath){
        deferred.resolve(targetPath);
      })
      .catch(function(errMsg, err){
        deferred.reject(errMsg, err);
      });

    return (deferred.promise);
  }
}

module.exports = new PackageListAlgebra();
