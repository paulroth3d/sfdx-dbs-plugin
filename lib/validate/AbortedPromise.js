/*jshint esversion: 6*/

const _ = require('underscore');
const Q = require('q');

/**
 * Represents a promise that did not failed, but was aborted by the end user. 
 * 
 * @class AbortedPromise
 */
class AbortedPromise {
  
  /**
   * Aborts the promise.
   * 
   * @param {scope} - scope for returned promise 'this'
   * @param {any} - all parameters passed will be sent to the reject.
   * @memberof AbortedPromise
   */
  abort(){
    const deferred = Q.defer();

    const argumentArray = _.union([],arguments);
    const scope = argumentArray.shift();

    deferred.reject.apply(scope, argumentArray);

    return (deferred.promise);
  }
}

module.exports = new AbortedPromise();
