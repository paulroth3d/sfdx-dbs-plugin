/*jshint esversion: 6*/

const _ = require('underscore');
const Q = require('q');
const DxConnection = require('../dx/DxConnection');
const child_process = require('child_process');
const FieldPrinter = require('./FieldDescribePrinter');

/**
 * Uses the Salesforce CLI to get schema information
 * 
 * @class SchemaUtil
 */
class SchemaUtil {

  /**
   * Get a Salesforce CLI description of a SObject
   * @param conn (DxConnection)
   * @param sObjectApiName (String)
   * @return Object - the Salesforce CLI description of the object.
   */
  getSObjectDescription(conn, sObjectApiName){
    const deferred = Q.defer();
    let self = this;

    if (!sObjectApiName){
      deferred.reject('Cannot get description of SObject without specifying which object');
      return deferred.promise;
    }

    var cmd = `sfdx force:schema:sobject:describe --json -s ${sObjectApiName}`;

    if (conn.lastAlias){
      cmd += ` -u ${conn.lastAlias}`;
    }

    //console.log('running this command:' + cmd);

    child_process.exec(cmd, function(err, stdout){
      if (err){
        deferred.reject('Error occurred while getting schema for sobject:' + sObjectApiName);
        return;
      }

      const resultObj = JSON.parse(stdout);

      deferred.resolve(resultObj.result);

      return;
    });

    return deferred.promise;
  }

  /**
   * Prints the fields for an SObject description
   */
  printSObjectFields(sObjectDescription, sortBy){
    //-- @TODO: investigate whether we should support JSON
    FieldPrinter.printSObjectFields(sObjectDescription, sortBy);
  }
}

module.exports = new SchemaUtil();