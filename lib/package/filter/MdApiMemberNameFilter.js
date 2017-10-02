/*jshint esversion: 6*/

const _ = require('underscore');
const Q = require('q');
const MdApiPackage = require('../MdApiPackage');
const MdApiPackageMember = MdApiPackage.member;

/**
 * Filters MdApiPackageMembers by Name
 * 
 * @class MdApiMemberNameFilter
 */
class MdApiMemberNameFilter {

  /**
   * Creates an instance of MdApiMemberNameFilter.
   * @param {string} nameFilter - regex pattern to match the full names to
   * @memberof MdApiMemberNameFilter
   * @throws Exception if nameFilter is not a valid regular expression
   */
  constructor(nameFilter){
    if (nameFilter){
      this.nameFilter = new RegExp(nameFilter, 'i');
    } else {
      this.nameFilter = null;
    }
  }

  /**
   * Filters out a list of MdApiPackageMembers
   * 
   * @param {MdApiPackageMember[]} packageMembers 
   * @return {MdApiPackageMember[]} - list of members that met the criteria.
   * @memberof MdApiMemberNameFilter
   */
  apply(packageMembers){
    let results = [];

    if (!packageMembers){
      return results;
    }

    let packageMember;
    let packageMemberName;
    if (!this.nameFilter){
      results = packageMembers;
    } else {
      for (var i = 0; i < packageMembers.length; i++ ){
        packageMember = packageMembers[i];
        packageMemberName = packageMember.getMemberName();
        if (packageMemberName && packageMemberName.match(this.nameFilter)){
          results.push(packageMember);
        }
      }
    }
    
    return (results);
  }
}

module.exports = MdApiMemberNameFilter;
