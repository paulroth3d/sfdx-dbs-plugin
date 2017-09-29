/*jshint esversion: 6*/
const Q = require('q');
const FS = require('fs-extra');
const PATH = require('path');
const LineByLineReader = require('line-by-line');
const _ = require('underscore');
const PackageConverter = require('./PackageConverter');
const MdApiPackage = require('../MdApiPackage');
const MdApiPackageType = MdApiPackage.type;
const MdApiPackageMember = MdApiPackage.member;
const MdApiPackageUtil = require('../MdApiPackageUtil');
const PackageWriter = require('../modify/PackageWriter');

/**
 * Class that converts from a PackageList.
 * @author Paul Roth
 */
class PackageListConverter {

  /**
   * Converts a line in a packge list to a MdApiPackageMember
   * 
   * @param {string} lineStr 
   * @return {MdApiPackageMember}
   * @memberof PackageListConverter
   */
  convertPackageListLine(lineStr){
    if (!lineStr){
      return null;
    }

    if (lineStr.match(/^\s+#/)){
      console.log( 'comment found. ignoring:' + lineStr);
      return null;
    }

    const pathResults = PATH.parse(lineStr);

    if (!pathResults.dir){
      return null;
    }

    const lineSplit = pathResults.dir.split(PATH.sep);
    const typeFolder = lineSplit.shift();
    const memberName = pathResults.name;
    const memberPath = lineSplit.join(PATH.sep);
    const typeName = MdApiPackageUtil.convertFolderToMeta(typeFolder);

    const results = new MdApiPackageMember(typeName, memberPath, memberName);

    return (results);
  }

  /**
   * Converts a packageList (from sourcePath) to JSON
   * 
   * @param {string} sourcePath 
   * @memberof PackageListConverter
   * @return {q.promise} 
   */
  convertPackageListToJSON(sourcePath, apiVersion){
    const deferred = Q.defer();
    const scope = this;

    if (!apiVersion){
      apiVersion = MdApiPackage.DEFAULT_API_VERSION;
    }

    FS.pathExists(sourcePath)
      .then( function(exists){
        if (!exists){
          console.log('source does not exist:' + sourcePath);
          deferred.reject('source does not exist:' + sourcePath);
          return;
        }
      
        const results = new MdApiPackage(apiVersion);
        const reader = new LineByLineReader(sourcePath);
      
        //console.log('source does exist:' + sourcePath);
      
        reader.on('error', function(err){
          console.error('error occurred while reading file');
          deferred.reject('Error occurred while reading file',err);
        });
        
        reader.on('line', function(line){
          //-- skip over empty lines
          if( line ){
            //console.log('found line:' + line);
            results.addMember(scope.convertPackageListLine(line));
          }
        });
        
        reader.on('end', function(){
          deferred.resolve(results);
        });
      })
      .catch(function(err){
        deferred.reject('Error occurred while trying to read:' + sourcePath, err);
      });

    return (deferred.promise); 
  }

  /**
   * Converts 
   * 
   * @param {MdApiPackage} packageJSON 
   * @param {string} targetPath - path to write the package.xml
   * @memberof PackageListConverter
   */
  convertsPackageJsonToPackageList(packageJSON, targetPath){
    {/* @TODO: complete **/}
  }

  /**
   * Converts a PackageList to an XML file.
   * 
   * @param {string} sourcePath 
   * @param {string} targetPath 
   * @param {string} apiVersion
   * @return {Q.promise} promise({sourcePath:string, targetPath:string, apiVersion:string})
   * @memberof PackageListConverter
   */
  convertPackageListToXml(sourcePath, targetPath, apiVersion){
    const deferred = Q.defer();
    const scope = this;

    if (!apiVersion){
      apiVersion = MdApiPackage.DEFAULT_API_VERSION;
    }
    
    this.convertPackageListToJSON(sourcePath, apiVersion)
      .then(function(packageJSON){
        
        //console.log('packageJSON returned');
        //console.log(JSON.stringify(packageJSON, null, 2));

        return (PackageConverter.convertPackageJsonToPackage(packageJSON));
      })
      .then(function(xmlWriter){
        return (PackageWriter.writeXmlToFile(xmlWriter, targetPath));
      })
      .then(function(packageWriterResults){
        deferred.resolve(true);
      })
      .catch(function(err){
        deferred.reject('Error occurred while trying to read:' + sourcePath, err);
      });
    
    return (deferred.promise);
  }

  /**
   * Converts a set of mdApiPackageMembers
   * 
   * @param {MdApiPackageMember[]} mdApiMembers
   * @returns {string[]} - collection of PackageList lines 
   * @memberof PackageListConverter
   */
  convertMdApiMembersToPackageListLines(mdApiMembers){
    const deferred = Q.defer();

    let results = [];
    if (!mdApiMembers){
      deferred.resolve(results);
      return (deferred.promise);
    }

    let member;
    let apiMember;
    let memberFolder;
    let memberExtension;
    for (var i = 0; i < mdApiMembers.length; i++){
      apiMember = mdApiMembers[i];
      memberFolder = MdApiPackageUtil.convertMetaToFolder(apiMember.getTypeName());
      memberExtension = MdApiPackageUtil.convertMetaToExtension(apiMember.getTypeName());
      //-- @TODO: investigate whether the path needs to be replaced with PATH.
      results.push(PATH.normalize( memberFolder + PATH.sep + apiMember.getPath() + PATH.sep + apiMember.getMemberName()));
    }

    deferred.resolve(results);
    
    return (deferred.promise);
  }
}

module.exports = new PackageListConverter();