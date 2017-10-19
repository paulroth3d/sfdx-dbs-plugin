/*jshint esversion: 6*/

const DEFAULT_API_VERSION = '40.0';

/**
 * Members under a given metadata type.
 * 
 * @class MdApiPackageType
 */
class MdApiPackageType {

  /**
   * Name of the MetadataAPI Type that the collection represents
   * 
   * @returns {string} - name of this type (ex: ApexClass, ApexTrigger, etc)
   * @memberof MdApiPackageType
   */
  getTypeName(){
    return (this.typeName);
  }

  /**
   * List of members contained within this type.
   * 
   * @returns {string[]} - collection of members held by this type
   * @memberof MdApiPackageType
   */
  getMembers(){
    return (this.members);
  }

  /**
   * Creates an instance of MdApiPackageType.
   * @param {string} typeName 
   * @memberof MdApiPackageType
   */
  constructor(typeName){
    this.typeName = typeName;
    this.members = [];
  }

  /**
   * Adds a member to this type
   * 
   * @param {MdApiPackageMember} member 
   * @memberof MdApiPackageType
   */
  addMember(member){
    this.members.push(member);
  }
}

/**
 * Class that represents an entry within the package
 * 
 * @class MdApiPackageMember
 */
class MdApiPackageMember {
  
  /**
   * Creates an instance of MdApiPackageMember.
   * @param {string} typeName - ex: ApexClass, ApexTrigger, Layout, etc.
   * @param {string} path - the path to the entry (only applies to document type entries)
   * @param {string} memberName - name of the resource (ex: LBL_MyCustomClassTest)
   * @memberof MdApiPackageMember
   */
  constructor(typeName, path, memberName){
    this.typeName = typeName;
    this.path = path;
    this.memberName = memberName;
  }

  /**
   * Type of the entry.
   * <p>ex: ApexClass, ApexTrigger, Layout, etc.</p>
   * 
   * @return {string}
   * @memberof MdApiPackageMember
   */
  getTypeName(){
    return (this.typeName);
  }

  /**
   * Determines the path of the member within the type
   * <p>Only applies within document types / folders</p>
   * 
   * @returns {string}
   * @memberof MdApiPackageMember
   */
  getPath(){
    return (this.path);
  }

  hasPath(){
    return (this.path?true:false);
  }

  /**
   * Determines the member name
   * 
   * @returns {string}
   * @memberof MdApiPackageMember
   */
  getMemberName(){
    return (this.memberName);
  }
}

/**
 * Object that represents the contents of an Metadata API Package.
 * @author Paul Roth
 * 
 * @class MdApiPackage
 */
class MdApiPackage {
  
  /**
   * Creates an instance of MdApiPackage.
   * @param {string} apiVersion 
   * @memberof MdApiPackage
   */
  constructor(apiVersion){
    this.apiVersion = apiVersion || DEFAULT_API_VERSION;
    this.types = {};
  }

  /**
   * API Version of the package
   * 
   * @return {string}
   * @memberof MdApiPackage
   */
  getApiVersion(){
    return (this.apiVersion);
  }

  /**
   * Collection of the members the package contains.
   * <p>Ex: CustomObject, ApexClass, etc.</p>
   * 
   * @return {MdApiPackageType[]}
   * @memberof MdApiPackage
   */
  getTypes(){
    return (this.types);
  }

  /**
   * Adds a member of a given type
   * 
   * @param {string} typeName - type of the member
   * @param {string} path - path of the member (when there are folders)
   * @param {string} memberName - name of the member
   * @returns {MdApiPackage}
   * @memberof MdApiPackage
   */
  addTypeMember(typeName,path,memberName){
    return (this.addMember(new MdApiPackageMember(typeName,path,memberName)));
  }

  /**
   * Adds to the package using a MdApiPackageMember
   * 
   * @param {MdApiPackageMember} member 
   * @returns {MdApiPackage}
   * @memberof MdApiPackage
   */
  addMember(member){
    if (!member){
      //-- do nothing
      return this;
    }

    const typeName = member.getTypeName();

    if (typeof this.types[typeName] === 'undefined'){
      this.types[typeName] = new MdApiPackageType(typeName);
    }
    const memberType = this.types[typeName];
    memberType.addMember(member);
    return this;
  }
}

MdApiPackage.type = MdApiPackageType;
MdApiPackage.member = MdApiPackageMember;
MdApiPackage.DEFAULT_API_VERSION = DEFAULT_API_VERSION;

module.exports = MdApiPackage;
