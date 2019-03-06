/*jshint esversion: 6*/
const Q = require('q');
const FS = require('fs-extra');
const PATH = require('path');
const _ = require('underscore');
const Xml2JS = require('xml2js');
const XMLWriter = require('xml-writer');
const MdApiPackageUtil = require('../MdApiPackageUtil');
const MdApiPackage = require('../MdApiPackage');
const MdApiPackageMember = MdApiPackage.member;
const MdApiPackageType = MdApiPackage.type;

/**
 * Writer for converting the MdApiPackage to Xml format.
 * 
 * @class MdApiPackageXmlWriter
 */
class MdApiPackageXmlWriter {

  /**
   * Constructor
   * 
   * @memberof MdApiPackageXmlWriter
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
   * @memberof MdApiPackageXmlWriter
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
   * @memberof MdApiPackageXmlWriter
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
   * Starts writing out a package xml based on a mdApiPackage.
   * 
   * @param {MdApiPackage} mdApiPackage 
   * @returns {q.promise<XmlWriter,errObj>}
   * @memberof MdApiPackageXmlWriter
   */
  execute(mdApiPackage){
    const deferred = Q.defer();

    this.output = new XMLWriter('\t');
    this.output.startDocument('1.0', 'UTF-8');
    
    let root = this.output.startElement('Package');

    root.startElement('version').text(MdApiPackage.DEFAULT_API_VERSION).endElement();

    let packageTypes = mdApiPackage.getTypes();
    let packageType;
    for (var key in packageTypes){
      if( mdApiPackage.types.hasOwnProperty(key)){
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
 * Package that facilitates converting a Package XML
 * to a mdApiPackage object
 * 
 * @class PackageImporter
 */
class PackageImporter {

  /**
   * Constructor
   * @memberof PackageImporter
   */
  constructor(){
    this.mdApiPackage = new MdApiPackage(MdApiPackage.DEFAULT_API_VERSION);
  }

  /**
   * Imports a package from file
   * 
   * @param {string} targetPath 
   * @returns {q.promise<mdApiPackage,errObj>}
   * @memberof PackageImporter
   */
  importFromFile(targetPath){
    const deferred = Q.defer();
    const self = this;
    
    try {
      FS.readFile(targetPath, function(err,data){
        if (err){
          console.error('error occurred while reading:' + targetPath);
          deferred.reject(err);
          return;
        }

        self.importFromString(data)
          .then(function(mdApiPackage){
            deferred.resolve(mdApiPackage);
          })
          .catch(function(err){
            deferred.reject(err);
          });
      });
    } catch(err){
      deferred.reject(err);
    }

    return (deferred.promise);
  }

  /**
   * Converts a package xml in string form
   * 
   * @param {string} xmlString 
   * @return {q.promise<mdApiPackage,err>}
   * @memberof PackageImporter
   */
  importFromString(xmlString){
    const deferred = Q.defer();
    const self = this;
    const parser = new Xml2JS.Parser({normalize:true, normalizeTags:true});

    parser.parseString(xmlString, function(err, result){
      self.assignApiVersion(self.scrubValue(result.package.version));

      for (var i = 0; i < result.package.types.length; i++){
        self.importTypeNode(result.package.types[i]);
      }

      deferred.resolve(self.mdApiPackage);
    });

    return deferred.promise;
  }

  /**
   * Scrubs an xml2js value from an array / literal
   * to a literal value.
   * @param {string[]} - val
   * @return {string}
   */
  scrubValue(val){
    if (_.isArray(val)){
      val = val[0];
    }
    return (val);
  }

  /**
   * Assigns the apiVersion for the converted package.
   * @private
   * @param {string} - either a string or 
   */
  assignApiVersion(apiVersion){
    //-- @TODO: review updating the package to allow updating the version
    this.mdApiPackage = new MdApiPackage(apiVersion);
  }

  /**
   * Converts a type section within an xml
   * 
   * @param {any} typeXmlNode - mdApi node representing package type
   * @memberof PackageImporter
   */
  importTypeNode(typeXmlNode){
    if (typeXmlNode){
      const typeName = this.scrubValue(typeXmlNode.name);
      const metadataType = typeName;

      let member;
      let memberName;
      let memberExtension = MdApiPackageUtil.convertMetaToExtension(metadataType);
      
      for (var i = 0; i < typeXmlNode.members.length; i++){
        memberName = typeXmlNode.members[i];
        if (memberName){
          this.mdApiPackage.addTypeMember(metadataType, '', memberName + memberExtension);
        }
      }
    }
  }
}

/**
 * Class that converts from a Package file (XML).
 * @author Paul Roth
 * @class PackageConverter
 */
class PackageConverter {

  /**
   * converts a package xml file to a mdApiPackage object.
   * 
   * @param {string} sourcePath - path to the source xml file.
   * @returns {MdApiPackage}
   * @memberof PackageConverter
   */
  convertPackageToMdApiPackage(sourcePath){
    const deferred = Q.defer();
    const scope = this;

    const importer = new PackageImporter();
    importer.importFromFile(sourcePath)
      .then(function(mdApiPackage){
        deferred.resolve(mdApiPackage);
      })
      .catch(function(err){
        deferred.reject(err);
      });

    return deferred.promise;
  }

  /**
   * Converts from the JSON version of the package to an XML format.
   * 
   * @param {MdApiPackage} mdApiPackage 
   * @param {string} targetPath - target path for where the xml file is going.
   * @returns {q.promise<XmlWriter,errObj>} - an XmlWriter contents for the package.
   * @memberof PackageConverter
   */
  convertMdApiPackageToPackage(mdApiPackage, targetPath){
    const deferred = Q.defer();
    targetPath = '';

    const writer = new MdApiPackageXmlWriter();
    writer.execute(mdApiPackage)
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