/*jshint esversion: 6*/

const _ = require('underscore');
const Q = require('q');
const FS = require('fs-extra');
const DxConnection = require('../../lib/dx/DxConnection');
const JsForceUtil = require('../../lib/jsforce/JsForceUtil');
const MdApiPackageUtil = require('../../lib/package/MdApiPackageUtil');
const PackageListAlgebra = require('../../lib/package/modify/PackageListAlgebra');
const PackageListConverter = require('../../lib/package/convert/PackageListConverter');
const MdApiMemberNameFilter = require('../../lib/package/filter/MdApiMemberNameFilter');
const PromptConfirmContinue = require('../../lib/prompt/PromptConfirmContinue');
const AbortedPromise = require('../../lib/validate/AbortedPromise');

/**
* Cleans the request and defaults as needed.
* 
* @param {any} config 
* @returns 
*/
function cleanContext(config){

  if (config.flags){
    config = config.flags;
  }

  config = _.defaults(config, {
  });

  if (!config.target){
    throw('--target is required');
  }

  if (!config.type){
    throw('--type is required');
  }

  if (!config.alias){
    throw('--alias is required');
  }

  return (config);
}

/**
 *  module
 *  @author Paul Roth <proth@salesforce.com>
**/
(function (){
  'use strict';
  
  module.exports = {
    topic: 'packageList',
    command: 'addFromOrg',
    description: 'Adds items of a given type (and filter) from the Salesforce Org to a PackageList',
    help: 'Adds items of a given type (and filter) from the Salesforce Org to a PackageList',
    flags: [{
      name: 'target',
      char: 't',
      description: 'Relative path of the PackageList to the packageList to modify',
      hasValue: true
    },{
      name: 'alias',
      char: 'a',
      description: 'Connection Alias',
      hasValue: true
    },{
      name: 'type',
      char: 'y',
      description: 'The Metadata API type of the member',
      hasValue: true
    },{
      name: 'filter',
      char: 'f',
      description: 'Only include items that match this regex filter',
      hasValue: true
    },{
      name: 'bypassConfirmation',
      char: 'c',
      description: 'Confirm changes prior to making any commits'
    }],

    cleanContext: cleanContext,
    
    run(context){
      const deferred = Q.defer();

      //-- context to create integration tests from
      //console.log(JSON.stringify(context)); deferred.resolve(true); return (deferred.promise);

      try {
        context = cleanContext(context);
      } catch(err){
        console.error(JSON.stringify(err, null, 2));
        deferred.reject(err);
        return (deferred.promise);
      }

      const targetPath = context.target;
      const dxConnection = new DxConnection();
      dxConnection.refreshConnection(context.alias)
        .then(function(jsForce){
          return JsForceUtil.getTypeMembers(dxConnection, context.type, '');
        })
        .then(function(metadata){
          return (MdApiPackageUtil.convertMetadataApiMembers(metadata));
        })
        .then(function(mdApiMembers){
          let filter = new MdApiMemberNameFilter(context.filter);
          let filterResults = filter.apply(mdApiMembers);

          //-- sort
          const sortedResults = _.sortBy(filterResults, function(mdApiMember){
            if(mdApiMember){
              return(mdApiMember.getMemberName());
            } else {
              return(mdApiMember);
            }
          });

          return (sortedResults);
        })
        .then(function(mdApiMembers){
          //-- confirm before doing anything

          if (!mdApiMembers || mdApiMembers.length < 1){
            return AbortedPromise.abort('No members were found matching filter criteria');
          }

          let confirmationPrompt = new PromptConfirmContinue(context.bypassConfirmation);

          if (!confirmationPrompt.shouldBypassConfirmations){
            console.log('We found the following for type [' + context.type + ']');
            if (context.filter){
              console.log('for pattern[' + context.filter + ']');
            }
            for (var i = 0; i < mdApiMembers.length; i++){
              console.log('\t' + mdApiMembers[i].getMemberName());
            }
          }
          
          return (confirmationPrompt.shouldContinue(mdApiMembers));
        })
        .then(function(mdApiMembers){
          return (PackageListAlgebra.addPackageMembers(targetPath, mdApiMembers));
        })
        .then(function(targetPath){
          return FS.readFileSync(targetPath, {encoding: 'UTF-8'});
        })
        .then(function(contents){
          console.log('Updated Package List: ' + targetPath + '\n[contents below]\n\n\n');
          console.log(contents);
          deferred.resolve(targetPath);
        })
        .catch(function(errMsg,errObj){
          if (errMsg){
            console.error(errMsg);
          }
          if (errObj){
            console.error(JSON.stringify(errObj, null, 2));
          }
          deferred.reject(errMsg, errObj);
        });
      
      return (deferred.promise);
    }
  };
}());