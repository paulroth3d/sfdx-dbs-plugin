/*jshint esversion: 6*/
const FS = require('fs-extra');
const PATH = require('path');
const Q = require('q');
const _ = require('underscore');

/**
 * Very minimal implementation
 * @param config.msg (String) - the message to say
 * @return (Q.Promise(String) - the augmented message
 */
function sayHelloImp(config){
  const deferred = Q.defer();

  config = _.defaults(config, {
    msg: 'Hello'
  });

  deferred.resolve('Polly says:"' + config.msg + '". Bawk.');

  return(deferred.promise);
}

/**
 *  module
 *  @author [[firstname lastname]] <email>
**/
(function () {
  'use strict';
  
  module.exports = {
    topic: 'example',
    command: 'sayHello',
    description: 'Minimal example of a module command / parrots a message',
    help: 'Parrots a message. See here for more info: https://www.youtube.com/watch?v=dWUQOy2qdTc&t=7m40s',
    flags: [{
      name: 'msg',
      char: 'm',
      description: 'What message to say',
      hasValue: true
    }],
    
    //-- use for testing or move implementation to separate module.

    sayHello:sayHelloImp,
    
    run(context){
      sayHelloImp(context.flags)
        .then(function(msg){
          console.log(msg);
        })
        .catch(function(errMsg){
          console.error('error occurred:' + errMsg);
        });
    }
  };
}());