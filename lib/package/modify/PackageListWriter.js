/*jshint esversion: 6*/

const Q = require('q');
const FS = require('fs-extra');
const _ = require('underscore');
const XMLWriter = require('xml-writer');

/**
 * Class that writes and modifies Package Lists
 * 
 * @class PackageListWriter
 */
class PackageListWriter {

  /**
   * Appends a line to a packageList file.
   * 
   * @param {string} packageListText 
   * @param {string} targetPath 
   * @returns {q.promise}
   * @memberof PackageListWriter
   */
  appendToPackageList(packageListText, targetPath){
    const deferred = Q.defer();

    try {
      FS.appendFile(targetPath, packageListText, function(err){
        if (err){
          deferred.reject('Error occurred while writing file', err);
          return;
        }

        deferred.resolve(targetPath);
      });
    } catch(err){
      console.log('error occurred while writing file:' + targetPath);
      console.log(JSON.stringify(err, null, 2 ));
      deferred.reject('Error occurred while writing to file:' + targetPath, err);
    }

    return deferred.promise;
  }

  /**
   * Writes a set of text to a packageList file.
   * 
   * @param {string} packageListText 
   * @param {string} targetPath 
   * @returns {q.promise}
   * @memberof PackageListWriter
   */
  writeToPackageList(packageListText, targetPath){
    const deferred = Q.defer();

    try {
      FS.writeFileSync(targetPath, packageListText, {encoding: 'UTF-8'});
      deferred.resolve(targetPath);
    } catch(err){
      console.log('error occurred while writing file:' + targetPath);
      console.log(JSON.stringify(err, null, 2 ));
      deferred.reject('Error occurred while writing to file:' + targetPath, err);
    }

    return deferred.promise;
  }
}

module.exports = new PackageListWriter();