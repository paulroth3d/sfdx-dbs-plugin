const logLatest = require('./commands/log/latest.js');

(function () {
  'use strict';
  
  exports.namespace = {
    name: 'dbs',
    description: 'A collection of SalesForce DX CLI plugins by Paul Roth'
  };
  
  exports.topics = [{
    name:'log',
    description: 'Reports on the latest cli JSON log',
  }];
  
  exports.commands = [
    logLatest
  ];
}());