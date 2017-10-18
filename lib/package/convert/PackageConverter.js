/*jshint esversion: 6*/
const Q = require('q');
const FS = require('fs-extra');
const PATH = require('path');
const _ = require('underscore');
const XMLWriter = require('xml-writer');
const MdApiPackageUtil = require('../MdApiPackageUtil');
const MdApiPackage = require('../MdApiPackage');
const MdApiPackageMember = MdApiPackage.member;
const MdApiPackageType = MdApiPackage.type;

/**
 * Writer for converting the PackageJSON to Xml format.
 * 
 * @class PackageJsonXmlWriter
 */
class PackageJsonXmlWriter {

  /**
   * Constructor
   * 
   * @memberof PackageJsonXmlWriter
   */
  constructor(){
    this.clear();
  }

  clear(){
    this.output = null;
  }

  /**
   * Writes a package type to xml
   * 
   * @param {XMLWriter} xmlWriter 
   * @param {MdApiPackageType} packageType 
   * @memberof PackageJsonXmlWriter
   */
  writePackageType(xmlWriter, packageType){
    let typesNode = xmlWriter.startElement('types');

    typesNode.startElement('name').text(packageType.getTypeName()).endElement();
    
    let members = packageType.getMembers();
    let member;
    for (var i = 0; i < members.length; i++){
      this.writePackageMember(xmlWriter, members[i]);
    }

    typesNode.endElement();
  }

  /**
   * Writes a packageMember to xml
   * 
   * @param {XMLWriter} xmlWriter 
   * @param {MdApiPackageMember} packageMember 
   * @memberof PackageJsonXmlWriter
   */
  writePackageMember(xmlWriter, packageMember){
    let memberPath = '';
    if (packageMember.hasPath()){
      memberPath += packageMember.getPath() + PATH.sep;
    }
    memberPath += packageMember.getMemberName();
    xmlWriter.startElement('members').text(memberPath).endElement();
  }

  /**
   * Starts writing out a package xml based on a packageJSON.
   * 
   * @param {MdApiPackage} packageJSON 
   * @returns {q.promise<XmlWriter,errObj>}
   * @memberof PackageJsonXmlWriter
   */
  execute(packageJSON){
    const deferred = Q.defer();

    this.output = new XMLWriter('\t');
    this.output.startDocument('1.0', 'UTF-8');
    
    let root = this.output.startElement('Package');

    root.startElement('version').text(MdApiPackage.DEFAULT_API_VERSION).endElement();

    let packageTypes = packageJSON.getTypes();
    let packageType;
    for (var key in packageTypes){
      if( packageJSON.types.hasOwnProperty(key)){
        packageType = packageTypes[key];
        this.writePackageType(root, packageType);
      }
    }
    
    root.endElement();
    root.endDocument();

    deferred.resolve(this.output);

    return deferred.promise;
  }
}

/**
 * Class that converts from a Package file (XML).
 * @author Paul Roth
 */
class PackageConverter {

  convertPackageToJSON(sourcePath){
    {/** @TODO: complete */}
  }

  /**
   * Converts from the JSON version of the package to an XML format.
   * 
   * @param {MdApiPackage} packageJSON 
   * @param {string} targetPath - target path for where the xml file is going.
   * @returns {q.promise<XmlWriter,errObj>} - an XmlWriter contents for the package.
   * @memberof PackageConverter
   */
  convertPackageJsonToPackage(packageJSON, targetPath){
    const deferred = Q.defer();
    targetPath = '';

    const writer = new PackageJsonXmlWriter();
    writer.execute(packageJSON)
      .then(function(results){
        deferred.resolve(results);
      })
      .catch(function(errObj){
        deferred.reject(errObj);
      });

    return(deferred.promise);
  }

  /**
   * Converts an xml file to a packageList
   * 
   * @param {string} sourcePath 
   * @param {string} targetPath 
   * @return {Q.promise<boolean,errObj>}
   * @memberof PackageListConverter
   */
  convertToPackageList(sourcePath, targetPath){
    const deferred = Q.defer();
    deferred.resolve(true);
    return (deferred.promise);
  }
}

module.exports = new PackageConverter();