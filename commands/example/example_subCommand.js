/*jshint esversion: 6*/
const FS = require('fs-extra');
const PATH = require('path');
const Q = require('q');
const _ = require('underscore');

/**
 *  module
 *  @author [[firstname lastname]] <email>
**/
(function () {
  'use strict';
  
  module.exports = {
    topic: 'example',
    command: 'sub:command',
    description: 'Example sub-command',
    help: '',
    flags: [],
    
    run(context){
      console.log('Simply make the \'command\' include colons to appear to be more than one topic deep');
    }
  };
}());