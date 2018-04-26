/*jshint esversion: 6*/
const log = require('./commands/log/latest');
const zipFile = require('./commands/zip/zip_compress_dir');
const unzipFile = require('./commands/zip/zip_uncompress');
const exampleSayHello = require('./commands/example/example_sayHello');
const exampleSubCommand = require('./commands/example/example_subCommand');
const convertToPackage = require('./commands/packageList/packageList_convertToPackage');
const manuallyAddToPackageList = require('./commands/packageList/packageList_addManual');
const clearPackageList = require('./commands/packageList/packageList_clear');
const listAllTypes = require('./commands/list/list_allTypes');
const listFromOrg = require('./commands/list/list_listFromOrg');
const addFromOrgCommand = require('./commands/packageList/packageList_addFromOrg');
const packageBlank = require('./commands/package/package_blank');
const packageConvertToPackageList = require('./commands/package/package_convertToPackageList');
const packageChunk = require('./commands/package/package_chunk');
const watchLightning = require('./commands/watch/watch_lightning');

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
    name:'zip',
    description: 'zip functionality (compress/uncompress)'
  },{
    name: 'package',
    description: 'Manages and manipulates package files'
  },{
    name: 'packageList',
    description: 'Manages and manipulates packageLists'
  },{
    name: 'watch',
    description: 'Watch and run commands as files update'
  }];
  
  exports.commands = [
    log,
    exampleSayHello,
    exampleSubCommand,

    //-- zip
    zipFile,
    unzipFile,

    //-- convert
    convertToPackage,

    //-- modify
    manuallyAddToPackageList,
    addFromOrgCommand,
    clearPackageList,

    //-- package
    packageBlank,
    packageConvertToPackageList,
    packageChunk,

    //-- list
    listAllTypes,
    listFromOrg,

    //-- watch
    watchLightning
  ];
}());