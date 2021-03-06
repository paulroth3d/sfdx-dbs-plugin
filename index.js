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
const describeFields = require('./commands/describe/describe_fields');
const shareLoginUrl = require('./commands/share/share_loginUrl');
const shareAccessInfo = require('./commands/share/share_accessInfo');
const shareFrontDoorUrl = require('./commands/share/share_frontDoorUrl');

(function () {
  'use strict';
  
  exports.namespace = {
    name: 'dbs',
    description: 'A collection of SalesForce DX CLI plugins by Paul Roth'
  };
  
  exports.topics = [{
    name: 'describe',
    description: 'Describe various salesforce information'
  },{
    name:'example',
    description: 'example namespace',
  },{
    name:'list',
    description: 'Lists metadata avaialable within an org',
  },{
    name:'log',
    description: 'Reports on the latest cli JSON log',
  },{
    name: 'package',
    description: 'Manages and manipulates package files'
  },{
    name: 'packageList',
    description: 'Manages and manipulates packageLists'
  },{
    name: 'share',
    description: 'Share Salesforce information'
  },{
    name: 'watch',
    description: 'Watch and run commands as files update'
  },{
    name:'zip',
    description: 'zip functionality (compress/uncompress)'
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

    //-- describe
    describeFields,

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

    //-- share access
    shareLoginUrl,
    shareFrontDoorUrl,
    shareAccessInfo,

    //-- watch
    watchLightning
  ];
}());