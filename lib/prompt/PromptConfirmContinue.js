/*jshint esversion: 6*/

const _ = require('underscore');
const Q = require('q');
const PROMPT = require('prompt');

/**
 * Prompts the user to continue or abort
 * 
 * @class PromptConfirmContinue
 */
class PromptConfirmContinue {

  /**
   * Creates an instance of PromptConfirmContinue.
   * @param {boolean} shouldPrompt - whether a prompt should be given (true) or not (false)
   * @memberof PromptConfirmContinue
   */
  constructor(shouldPrompt){
    this.shouldBypassConfirmations = !shouldPrompt;
  }
  
  /**
   * Determines whether the user wants to continue (true) or abort (false);
   * 
   * @param {any} argsToPass - Object to pass as the 'then' promise;
   * @returns {Q.prompse}
   * @memberof PromptConfirmContinue
   */
  shouldContinue(argsToPass){
    const deferred = Q.defer();

    if (this.shouldBypassConfirmations){
      deferred.resolve(argsToPass);
    } else {
      PROMPT.get([{
        name: 'shouldContinue',
        description: 'Should we continue (true) or abort (false)',
        type: 'boolean',
        required: true
      }], function(err, results){
        if (err){
          deferred.reject('Error while asking whether to continue', err);
          return (deferred.promise);
        }

        if (!results.shouldContinue){
          console.log('User requested to abort');
          deferred.reject('Aborting from user request');
        } else {
          deferred.resolve(argsToPass);
        }
      });
    }

    return (deferred.promise);
  }
}

module.exports = PromptConfirmContinue;
