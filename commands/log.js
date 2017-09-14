/*jshint esversion: 6*/
const fs = require('fs-extra');
const path = require('path');
const LineByLineReader = require('line-by-line');
const Q=require('q');

/**
 *  Module that works with the latest logs of sfdx CLI.
 *  @author Paul Roth <proth@salesforce.com>
**/
(function () {
  'use strict';
  
  /**
   *  Determines the home directory for the current user
   *  based on the context.
   *  @param context (object) - context from the sfdx cli
   *  @return (String) path to the user's home directory;
  **/
  function getHomeLog(context){
    let results = '';
    if( !context || !context.herokuDir ){
      throw('could not find home directory');
    } else {
      results = path.join( context.herokuDir, '..', '..', '.sfdx', 'sfdx.log' );
    }
    return( results );
  }
  
  /**
   * Determines the last line of the log.
   * @param logPath
   * @return Promise (lastLineOfFile:String)
   **/
  function getLastLineOfFile(logPath){
    let deferred=Q.defer();
    
    fs.pathExists(logPath)
      .then( function(exists){
        //console.log('exists');
        //console.log('logPath:' + logPath);
        
        let reader = new LineByLineReader(logPath);
        let lastFunctionalLine='';
        
        reader.on('error', function(err){
          deferred.reject('Error occurred while reading file',err);
        });
        
        reader.on('line', function(line){
          //-- skip over empty lines
          if( line ){
            lastFunctionalLine=line;
          }
        });
        
        reader.on('end', function(){
          //console.log('end of file');
          //console.log('last functional line');
          //console.log(lastFunctionalLine);
          deferred.resolve(lastFunctionalLine);
        });
      })['catch']( function( err, exists){
        deferred.reject('Error caught before reading file', err);
      });
    
    return(deferred.promise);
  }

  /**
   * Determines the JSON context from the file provided
   * @param lastLineFromFile (String)
   * @return Object - parsed object
   **/
  function getContextObject(lastLineFromFile){
    //console.log('context object');
    let deferred=Q.defer();
    try {
      let contextObj=JSON.parse(lastLineFromFile);
      if(!contextObj){
        deferred.reject('Unable to parse the last log line', {logLine:lastLineFromFile});
      }
      deferred.resolve(contextObj);
    } catch(err){
      deferred.reject('Error occurred while parsing last log line', {err:err, logLine:lastLineFromFile});
    }
    return(deferred.promise);
  }
  
  /**
   *  Attempts to get the message from the response
   *  @param context (Object) - dx log context
   *  @return (Object) - the parsed msg context
  **/
  function getMessageContext(context){
    //console.log('getMessageContext');
    let deferred=Q.defer();
    let msg;
    
    if( !context ){
      deferred.reject('Empty context found',context);
      return(deferred.promise);
    } else if( !context.msg ){
      //-- little we can do, so just provide the context as we have it.
      deferred.resolve({context:context, msg:context});
      return(deferred.promise);
    }
    
    //console.log('found context.msg'); console.log(JSON.stringify(context.msg,null,2));
    //now check if the text is JSON
    
    if (!context.msg.match(/^(\[|\{)/)){
      //console.log('Msg is not an object or array, so just return it'); console.log(context.msg);
      deferred.resolve({context:context, msg:context.msg});
      return(deferred.promise);
    }
    
    //console.log('assume results is some form of JSON');
    
    //-- json does not support single quotes
    let msgObj;
    try {
      msgObj=JSON.parse(context.msg);
    } catch(err){
      try {
        //-- attempt to escape quotes, correct escaped quotes and use double quotes because single are not allowed for definitions.
        let fixedMsg=context.msg.replace(/"/g, '\\"').replace(/\\'/g,'`').replace(/'/g, '"');
        msgObj=JSON.parse(fixedMsg);
      } catch(err){
        //-- pr: the trouble is that the data is either a String, or JSON or an array of JSON, among other formats.
        deferred.reject('Giving up trying to correct msg attribute - not valid JSON', context.msg);
      }
    }
    
    if(!msgObj){
      deferred.reject('unable to parse msg', JSON.stringify(context.msg, null, 2));
      return (deferred.promise);
    }
    
    //console.log('msgObj');console.log(JSON.stringify(msgObj,null,false));
    
    //-- determine if it is an array
    
    if( typeof msgObj.length === 'undefined' ){
      console.log('it is an object');console.log(JSON.stringify(msgObj, null, 2));
      deferred.resolve({context:context, msg:msgObj});
      return (deferred.promise);
    }
    
    //console.log('it is an array');console.log(JSON.stringify(msgObj, null, 2));
      
    let msgArray=msgObj;
    let msgStr2;
    let cleanedMsgArray=[];
    for( var i = 0; i < msgArray.length; i++ ){
      if (msgArray[i] && typeof msgArray[i] == 'string'){
        
        msgStr2=null;
        
        try {
          msgStr2=JSON.parse(msgArray[i]);
        } catch(err){
          //console.log('error occurred while trying to parse array[' + i + ']'); console.log(JSON.stringify(err));
          
          msgStr2=msgArray[i];
        }
        
        //-- either get an object or put the string.
        cleanedMsgArray.push(msgStr2);
      } else {
        //-- not a string -- just add it.
        cleanedMsgArray.push(msgArray[i]);
      }
    }
    
    //console.log('cleanedMsgArray'); console.log(JSON.stringify(cleanedMsgArray, null, 2));
    
    deferred.resolve({context:context, msg:cleanedMsgArray});
    return(deferred.promise);
  }
  
  module.exports = {
    topic: 'log',
    command: 'latest',
    description: 'Reports on the latest cli JSON log',
    help: 'See here for more information: https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_cli_log_messages.htm',
    flags: [{
      name: 'format',
      char: 'f',
      description: 'Format for output: json (default) or table',
      hasValue: true
    }],
    run(context){
      //console.log( 'ran the command' );
      //console.log( JSON.stringify(context,null,2) );
      
      let homeLog=getHomeLog(context);
      //console.log('homeLog=' + homeLog);
      
      getLastLineOfFile(homeLog)
        .then(function(lastLineOfFile){
          //console.log('success:'+lastLineOfFile);
          return(getContextObject(lastLineOfFile));
        })
        .then(function(contextObj){
          //console.log('found context object'); console.log(JSON.stringify(contextObj,null,2));
          return(getMessageContext(contextObj));
        })
        .then(function(results){
          console.log('\n\n' +
            'When running as:' + results.context.hostname + '\n' +
            'At ' + results.context.time + '\n' +
            'the following logs were found:\n'
          );
          console.log(JSON.stringify(results.msg,null,2));
          //console.log('from here');
          //console.log(JSON.stringify(results,null,2));
          //console.log('found msg context');
          //console.log(JSON.stringify(results.context,null,2));
          //console.log('msgContext');
          //console.log(JSON.stringify(results.msg,null,2));

        }).catch( function(msg,errObj){
          console.error('Error:' + msg );
          console.error(JSON.stringify(errObj,null,2));
        });
    }
  };
}());