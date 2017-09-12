const log = require('./commands/log.js');

(function () {
  'use strict';
  
  exports.topics = [{
    name:'log',
    description: 'Reports on the latest cli JSON log',
  }];
  
  exports.namespace = {
    name: 'dbs',
    description: 'A collection of SalesForce DX CLI plugins by Paul Roth'
  };
  
  exports.commands = [
    log
  ];
}());