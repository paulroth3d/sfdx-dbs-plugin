/*jshint esversion: 6*/
const log = require('./commands/log/latest');
const compress = require('./commands/compress/dir');
const exampleSayHello = require('./commands/example/example_sayHello');

(function () {
  'use strict';
  
  exports.namespace = {
    name: 'dbs',
    description: 'A collection of SalesForce DX CLI plugins by Paul Roth'
  };
  
  exports.topics = [{
    name:'example',
    description: 'example namespace',
  },{
    name:'log',
    description: 'Reports on the latest cli JSON log',
  },{
    name:'compress',
    description: 'compress directory'
  }];
  
  exports.commands = [
    log,
    compress,
    exampleSayHello
  ];
}());