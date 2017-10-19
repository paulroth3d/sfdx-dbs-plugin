/*jshint esversion: 6*/
const fs = require('fs-extra');
const path = require('path');
const Q=require('q');
const compress=require('compressing');
const _=require('underscore');

/**
 *  Module that works with the latest logs of sfdx CLI.
 *  @author Paul Roth <proth@salesforce.com>
**/
(function () {
  'use strict';
  
  /**
   *  implementation to compress a directory.
   *  @param context.source (String) - path of the folder/file to zip
   *  @param context.target (String) - path to apply the zip to
   *  @return (Promise(isSuccessful:boolean, context:{ source:string, target:string })) 
  **/
  function compressDirectory(context){
    let deferred = Q.defer();

    //-- do not default for now.
    //context = _.defaults(context,{});
    
    //-- validate inputs
    if (!context.source){
      deferred.reject('INTERNAL ERROR: source is required');
      return (deferred.promise);
    }
    
    if (!context.target){
      context.target = context.source + '.zip';
    }

    console.log('Attempting to compress: ' + context.source + '\n' +
      'to: ' + context.target);

    fs.pathExists(context.source)
      .then( function(exists){
        if (exists){
          try {
            compress.zip.compressDir(context.source, context.target)
              .then(function(compressingDone){
                deferred.resolve(context);
              })
              .catch(function(compressingError){
                deferred.reject('UNEXPECTED ERROR', compressingError);
              });
          } catch (err){
            deferred.reject('error occurred', arguments);
          }
        } else {
          deferred.reject('source does not exist');
        }
      })
      .catch( function(err){
        console.error(JSON.stringify(err, null, 2));
        deferred.reject('Unable to compress: ' + context.source);
      });

    return (deferred.promise);
  }
  
  module.exports = {
    topic: 'zip',
    command: 'compress:dir',
    description: 'Compresses a directory using zip format',
    help: '',
    flags: [{
      name: 'source',
      char: 's',
      description: 'Relative path to directory to compress',
      hasValue: true
    },{
      name: 'target',
      char: 't',
      description: 'Relative for the resulting zip',
      hasValue: true
    }],
    
    run(context){
      var deferred=Q.defer();
      
      //console.log('start the compress command');
      //console.log(JSON.stringify(context, null, 2 ));
      
      compressDirectory(context.flags)
        .then(function(context){
          console.log('success');
          deferred.resolve(true);
        })
        .catch(function(errMsg, errObject){
          if (errMsg){
            console.error(errMsg);
          } else {
            console.error('An error occurred');
          }

          if (errObject){
            console.error(JSON.stringify(errObject, null, 2));
            deferred.reject('failure occurred while compressing');
          }
        });
      
      return (deferred.promise);
    }
  };
}());