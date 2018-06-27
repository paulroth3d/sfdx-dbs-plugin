/*jshint esversion: 6*/

const _ = require('underscore');
const Q = require('q');
const DxConnection = require('../dx/DxConnection');
const child_process = require('child_process');

/**
 *  Utility to determine access information.
 *  @class AccessUtil
 */
class AccessUtilSingleton {

  /**
   * Determines User Access information for a given scratch org
   * @param alias (String) - access alias
   * @return {AccessInfo}
   */
  getAccessInfo(alias){
    const deferred = Q.defer();
    let self = this;

    child_process.exec(`sfdx force:user:display -u ${alias} --json`, function(err, stdout){
      if (err){
        deferred.reject('Error occurred while accessing user alias:' + alias);
        return;
      }

      console.log('no error');
      const {status,result} = JSON.parse(stdout);
      
      var accessInfo = new AccessInfo();
      accessInfo.importCliAccess(result);

      deferred.resolve(accessInfo);
    });

    //-- uncomment for testing
    //var accessInfo = new AccessInfo();
    //accessInfo.importCliAccess(result);
    //deferred.resolve(accessInfo);

    return deferred.promise;
  }
}

class AccessInfo {

  importAccessInfo(accessInfo){
    _.extend(this,accessInfo);
  }
  
  /**
   * Imports access information from Salesforce CLI login info.
   * <p>See sfdx force:user:display -u ALIAS --json</p>
   * @param {any} params 
   */
  importCliAccess(params){
    params = _.defaults(params, {
    });

    this.accessInfo = params;
    this.userName = params.username;
    this.profileName = params.profileName;
    this.userId = params.id;
    this.orgId = params.orgId;
    this.accessToken = params.accessToken;
    this.instanceUrl = params.instanceUrl;
    this.loginUrl = params.loginUrl;
    this.alias = params.alias;
    this.password = params.password;
  }

  /**
   * Prints the access login
   * @return {string} - access login link
   */
  getLoginLink(startUrl){
    var results = this.instanceUrl + '?un=' + encodeURIComponent(this.userName) +
      '&pw=' + encodeURIComponent(this.password);
    if(startUrl){
      results += '&startURL=' + encodeURIComponent(startUrl);
    }
    return(results);
  }

  /**
   * Prints an access link (using an access token)
   * @return {string}
   */
  getFrontDoorLink(startUrl){
    var results = this.instanceUrl + '/secur/frontdoor.jsp?sid=' + this.accessToken;
    if(startUrl){
      results += '&retURL=' + encodeURIComponent(startUrl);
    }
    return(results);
  }

  /**
   * Prints the access in a human readible way.
   * @return {string}
   */
  toString(){
    var results = '' + 
      'userName:' + this.userName + '\n' +
      'profileName:' + this.profileName + '\n' +
      'userId:' + this.userId + '\n' +
      'orgId:' + this.orgId + '\n' +
      'instanceUrl:' + this.instanceUrl + '\n' +
      'loginUrl:' + this.loginUrl + '\n' +
      'alias:' + this.alias + '\n' +
      'password:' + this.password + '\n' +
      '';
    return(results);
  }


  /**
   * Prints the access in JSON
   * @return {string}
   */
  toJSON(){
    return _.defaults(this.accessInfo,{});
  }
}

const AccessUtil = new AccessUtilSingleton();

//module.exports = AccessUtil;
module.exports = {
  AccessUtil,
  AccessInfo
};