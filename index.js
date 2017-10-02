/*jshint esversion: 6*/
const log = require('./commands/log/latest');
const compress = require('./commands/compress/dir');
const exampleSayHello = require('./commands/example/example_sayHello');
const exampleSubCommand = require('./commands/example/example_subCommand');
const convertToPackage = require('./commands/packageList/packageList_convertToPackage');
const manuallyAddToPackageList = require('./commands/packageList/packageList_addManual');
const clearPackageList = require('./commands/packageList/packageList_clear');
const listAllTypes = require('./commands/list/list_allTypes');
const listFromOrg = require('./commands/list/list_listFromOrg');
const addTypeFromOrgCommand = require('./commands/packageList/packageList_addTypeFromOrg');

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
    name:'list',
    description: 'Lists metadata avaialable within an org',
  },{
    name:'log',
    description: 'Reports on the latest cli JSON log',
  },{
    name:'compress',
    description: 'compress directory'
  },{
    name: 'packageList',
    description: 'Manages and manipulates packageLists'
  }];
  
  exports.commands = [
    log,
    compress,
    exampleSayHello,
    exampleSubCommand,

    //-- convert
    convertToPackage,

    //-- modify
    manuallyAddToPackageList,
    addTypeFromOrgCommand,
    clearPackageList,

    //-- list
    listAllTypes,
    listFromOrg
  ];
}());