/*jshint esversion: 6*/

const Q = require('q');
const FS = require('fs-extra');
const _ = require('underscore');
const XMLWriter = require('xml-writer');

/**
 * Class that writes and modifies MdApi packages
 * 
 * @class PackageWriter
 */
class PackageWriter {
  /**
   * 
   * 
   * @param {XMLWriter} xmlWriter - xmlWriter with the contents to write.
   * @param {string} targetPath - path to write the file
   * @returns {string} - path of file written.
   * @memberof PackageWriter
   */
  writeXmlToFile(xmlWriter, targetPath){
    const deferred = Q.defer();

    try {
      FS.writeFileSync(targetPath, xmlWriter.toString(), {encoding: 'UTF-8'});
      
      //console.log('wrote file:' + targetPath);
      
      deferred.resolve(targetPath);
    } catch(err){
      console.log('error occurred while writing file:' + targetPath);
      console.log(JSON.stringify(err, null, 2));
      deferred.reject(JSON.stringify(err, null, 2));
    }

    return (deferred.promise);
  }
}

module.exports = new PackageWriter();