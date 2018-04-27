/*jshint esversion: 6*/

const Q = require('q');
const FS = require('fs-extra');
const PATH = require('path');
const _ = require('underscore');
const XMLWriter = require('xml-writer');
const MdApiPackage = require('./MdApiPackage');
const MdApiPackageType = MdApiPackage.type;
const MdApiPackageMember = MdApiPackage.member;

/**
 * Internal class that represents a translation for Settings.
 * <p>Settings are handled differently than most other things
 * as they translate to a different metadata type based
 * on the fileName.</p>
 * 
 * @class MdPackageSettingsTranslation
 */
class MdPackageSettingsTranslation {
  constructor(fileName,typeName){
    this.fileName = fileName;
    this.typeName = typeName;
  }
}


/**
 * Class that represents the conversion between Metadata API to folders, extensions and other file related items.
 * 
 * @class metaDataConversion
 */
class MetaDataConversion {
  constructor(typeName, folderName, extension){
    this.typeName = typeName;
    this.folderName = folderName;
    this.extension = extension;
  }
}


/**
 * Utility class
 * 
 * @class MdApiPackageUtil
 */
class MdApiPackageUtil {

  /**
   * constructor
   * @memberof MdApiPackageUtil
   */
  constructor(){
    this.settingsTranslations = [
      new MdPackageSettingsTranslation('Account.settings', 'AccountSettings'),
      new MdPackageSettingsTranslation('Activities.settings', 'ActivitiesSettings'),
      new MdPackageSettingsTranslation('Address.settings', 'AddressSettings'),
      new MdPackageSettingsTranslation('BusinessHours.settings', 'BusinessHoursSettings'),
      new MdPackageSettingsTranslation('Case.settings', 'CaseSettings'),
      new MdPackageSettingsTranslation('ChatterAnswers.settings', 'ChatterAnswersSettings'),
      new MdPackageSettingsTranslation('Company.settings', 'CompanySettings'),
      new MdPackageSettingsTranslation('Contract.settings', 'ContractSettings'),
      new MdPackageSettingsTranslation('Entitlement.settings', 'EntitlementSettings'),
      new MdPackageSettingsTranslation('Forecasting.settings', 'ForecastingSettings'),
      new MdPackageSettingsTranslation('Ideas.settings', 'IdeasSettings'),
      new MdPackageSettingsTranslation('Knowledge.settings', 'KnowledgeSettings'),
      new MdPackageSettingsTranslation('LiveAgent.settings', 'LiveAgentSettings'),
      new MdPackageSettingsTranslation('Mobile.settings', 'MobileSettings'),
      new MdPackageSettingsTranslation('Opportunity.settings', 'OpportunitySettings'),
      new MdPackageSettingsTranslation('Product.settings', 'ProductSettings'),
      new MdPackageSettingsTranslation('Quote.settings', 'QuoteSettings'),
      new MdPackageSettingsTranslation('Security.settings', 'SecuritySettings')
    ];

    this.metaTranslations = [
      new MetaDataConversion('ActionOverride', 'objects', '.object' ),
      new MetaDataConversion('AnalyticSnapshot', 'analyticsnapshots', '.analyticsnapshot' ),
      new MetaDataConversion('AppMenu', 'appMenus', '.appMenu' ),
      new MetaDataConversion('ApprovalProcess', 'approvalProcesses', '.approvalProcess' ),
      new MetaDataConversion('ApexClass', 'classes', '.cls' ),
      new MetaDataConversion('ApexComponent', 'components', '.component' ),
      new MetaDataConversion('ApexPage', 'pages', '.page' ),
      new MetaDataConversion('ApexTrigger', 'triggers', '.trigger' ),
      new MetaDataConversion('ArticleType', 'objects', '.object' ),
      new MetaDataConversion('ConnectedApp', 'connectedapps', '*.connectedapp' ),
      new MetaDataConversion('BusinessProcess', 'objects', '.object' ),
      new MetaDataConversion('CustomApplication', 'applications', '.app' ),
      new MetaDataConversion('CustomField', 'objects', '.object' ),
      new MetaDataConversion('CustomLabels', 'labels', '.label' ),
      new MetaDataConversion('CustomObject', 'objects', '.object' ),
      new MetaDataConversion('CustomObjectTranslation', 'objectTranslations', '.objectTranslation' ),
      new MetaDataConversion('CustomPageWebLink', 'weblinks', '.weblink' ),
      new MetaDataConversion('CustomPermission', 'customPermissions', '.customPermission' ),
      new MetaDataConversion('CustomSite', 'sites', '.site' ),
      new MetaDataConversion('CustomTab', 'tabs', '.tab' ),
      new MetaDataConversion('Dashboard', 'dashboards', '.dashboard' ),
      new MetaDataConversion('DataCategoryGroup', 'datacategorygroups', '.datacategorygroup' ),
      new MetaDataConversion('Document', 'documents', '' ),
      new MetaDataConversion('EmailTemplate', 'email', '.email' ),
      new MetaDataConversion('EntitlementProcess', 'entitlementProcesses', '.entitlementProcess' ),
      new MetaDataConversion('EntitlementTemplate', 'entitlementTemplates', '.entitlementTemplate' ),
      new MetaDataConversion('EscalationRule', 'escalationRules', '.escalationRules' ),
      new MetaDataConversion('FieldSet', 'objects', '.object' ),
      new MetaDataConversion('FlexiPage', 'flexipages', '.flexipage' ),
      new MetaDataConversion('Flow', 'flow', '.flow' ),
      new MetaDataConversion('FlowDefinition', 'flowDefinitions', '.flowDefinition' ),
      new MetaDataConversion('GlobalValueSet', 'globalValueSets', '.globalValueSet' ),
      new MetaDataConversion('GlobalValueSetTranslation', 'globalValueSetTranslations', '.globalValueSetTranslation' ),
      new MetaDataConversion('Group', 'groups', '.group' ),
      new MetaDataConversion('HomePageComponent', 'homePageComponents', '.homePageComponent' ),
      new MetaDataConversion('HomePageLayout', 'homePageLayouts', '.homePageLayout' ),
      new MetaDataConversion('Layout', 'layouts', '.layout' ),
      new MetaDataConversion('Letterhead', 'letterhead', '.letterhead' ),
      new MetaDataConversion('ListView', 'objects', '.object' ),
      new MetaDataConversion('MilestoneType', 'milestoneTypes', '.milestoneType' ),
      new MetaDataConversion('NamedFilter', 'objects', '.object' ),
      new MetaDataConversion('PermissionSet', 'permissionsets', '.permissionset' ),
      new MetaDataConversion('Portal', 'portals', '.portal' ),
      new MetaDataConversion('Profile', 'profiles', '.profile' ),
      new MetaDataConversion('Queue', 'queues', '.queue' ),
      new MetaDataConversion('QuickAction', 'quickActions', '.quickAction' ),
      new MetaDataConversion('RecordType', 'objects', '.object' ),
      new MetaDataConversion('RemoteSiteSetting', 'remoteSiteSettings', '.remoteSiteSetting' ),
      new MetaDataConversion('Report', 'reports', '.report' ),
      new MetaDataConversion('ReportType', 'reportTypes', '.reportType' ),
      new MetaDataConversion('Role', 'roles', '.role' ),
      new MetaDataConversion('Scontrol', 'scontrols', '.scf' ),
      new MetaDataConversion('Settings', 'settings', '.settings' ),
      new MetaDataConversion('SharingReason', 'objects', '.object' ),
      new MetaDataConversion('SharingRecalculation', 'objects', '.object' ),
      new MetaDataConversion('StaticResource', 'staticresources', '.resource' ),
      new MetaDataConversion('Translations', 'translations', '.translation' ),
      new MetaDataConversion('ValidationRule', 'objects', '.object' ),
      new MetaDataConversion('Weblink', 'objects', '.object' ),
      new MetaDataConversion('Workflow', 'workflows', '.workflow' ),
      new MetaDataConversion('AuraDefinitionBundle', 'aura', '.aura' )
    ];
  }

  //-- setting translations

  /**
   * Converts from a settings fileName to the type.
   * @param {string} settingsFile - the name of the file
   * @returns {string} settingsType - the Metadata API member type.
   * @memberof MdApiPackageUtil
   */
  convertFromSettingsFileToType(settingsFile){
    let settingsTranslation;
    for( var i = 0; i < this.settingsTranslations.length; i++){
      settingsTranslation = this.settingsTranslations[i];
      if (settingsTranslation.fileName === settingsFile){
        return (settingsTranslation.typeName);
      }
    }
    return (null);
  }

  /**
   * Converts from a settings type to the filename.
   * @param {string} settingsType - the Metadata API member type.
   * @returns {string} settingsFile - the name of the file for that settings type.
   * @memberof MdApiPackageUtil
   */
  convertFromSettingsTypeToFile(settingsType){
    let settingsTranslation;
    for( var i = 0; i < this.settingsTranslations.length; i++){
      settingsTranslation = this.settingsTranslations[i];
      if (settingsTranslation.typeName === settingsType){
        return (settingsTranslation.fileName);
      }
    }
    return (null);
  }

  //-- metadata conversions

  /**
   * Converts from a MetadataType to the appropriate folder.
   * @param {string} typeName - the MetaData type to convert
   * @return {string} - the folder that type of metadata type is stored within.
   * @memberof MdApiPackageUtil
   */
  convertMetaToFolder(typeName){
    const results = _.find(this.metaTranslations, function(translation){
      return(translation.typeName === typeName);
    });
    if (results){
      return(results.folderName);
    } else {
      return('');
    }
  }

  /**
   * Converts from a folder to the appropriate Metadata type
   * @param {string} folderName 
   * @return {string} - the metadata type that uses that folder
   * @memberof MdApiPackageUtil
   */
  convertFolderToMeta(folderName){
    const results = _.find(this.metaTranslations, function(translation){
      return(translation.folderName == folderName);
    });
    if (results){
      return(results.typeName);
    } else {
      return('');
    }
  }

  /**
   * Converts a metadata type to the extension used for that type.
   * @param {string} typeName - the metadata type to convert
   * @returns {string} extension (including period) for the file
   * @memberof MdApiPackageUtil
   */
  convertMetaToExtension(typeName){
    const results = _.find(this.metaTranslations, function(translation){
      return(translation.typeName === typeName);
    });
    if (results){
      return(results.extension);
    } else {
      return('');
    }
  }

  /**
   * Converts a folder to the extension used for that type.
   * @param {string} folderName - the containing folder
   * @returns {string} extension (including period) for the file
   * @memberof MdApiPackageUtil
   */
  convertFolderToExtension(folderName){
    const results = _.find(this.metaTranslations, function(translation){
      return(translation.folderName === folderName);
    });
    if (results){
      return(results.extension);
    } else {
      return('');
    }
  }

  /**
   * Converts a collection of metadata api members to a collection of MdApiPackage.members
   * 
   * @param {any} metadataObject - collection of metadata api results
   * @returns {MdApiPackageMember[]}
   * @memberof MdApiPackageUtil
   */
  convertMetadataApiMembers(metadataObjects){
    let results = [];

    if (!metadataObjects){
      return (results);
    }

    if( !_.isArray(metadataObjects) ){
      metadataObjects = [metadataObjects];
    }

    let metadataObject;
    let parsedPath;
    for (var i = 0; i < metadataObjects.length; i++){
      metadataObject = metadataObjects[i];
      parsedPath = PATH.parse(metadataObject.fullName);
      results.push(new MdApiPackageMember(metadataObject.type, parsedPath.dir, parsedPath.name));
    }

    return (results);
  }
}

module.exports = new MdApiPackageUtil();