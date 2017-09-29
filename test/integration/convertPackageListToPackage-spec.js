/*eslint quotes: ['error', 'single']*/

let _ = require('underscore');
let assert = require('assert');
let fs = require('fs-extra');

const PackageListWriter = require('../../lib/package/modify/PackageListWriter');
const ConvertToPackageCommand = require('../../commands/packageList/packageList_convertToPackage');

const targetPackageList = 'testAssets/packageLists/testPackageList.txt';
const context = {'topic':null,'command':{'topic':'packageList','command':'convert','plugin':'sfdx-dbs-plugin','namespace':'dbs','usage':'','description':'Converts a packageList to a package','default':false,'help':'Converts a packageList to a package','fullHelp':'','hidden':false,'variableArgs':false,'disableAnalytics':false,'args':null,'flags':[{'name':'source','char':'s','description':'Relative path to the package list to convert','hasValue':true,'hidden':false,'required':false},{'name':'target','char':'t','description':'Path for the resulting package (xml) file','hasValue':true,'hidden':false,'required':false},{'name':'apiVersion','char':'a','description':'api version for the package, DEF:40.0','hasValue':true,'hidden':false,'required':false}]},'app':'','args':{},'flags':{'source':targetPackageList},'cwd':'/Users/proth/Documents/work/tools/sfdx-dbs-plugin','herokuDir':'/Users/proth/.cache/sfdx','debug':false,'debugHeaders':false,'dev':true,'supportsColor':true,'version':'sfdx-cli/5.7.7-94c4196 (darwin-amd64) go1.7.5 sfdx-dbs-plugin/0.0.1 node-v6.9.5','apiToken':'','apiHost':'api.heroku.com','apiUrl':'https://api.heroku.com','gitHost':'heroku.com','httpGitHost':'git.heroku.com'};

const samplePackageListContents = [ '#some description',
  'package.xml',
  'reportTypes/AdPlans.reportType',
  'reportTypes/Advertisements.reportType',
  'reportTypes/Events.reportType',
  'reportTypes/EventsWithDeals.reportType',
  'reportTypes/Events_Summary.reportType',
  'reportTypes/Events_and_Ad_Plans.reportType',
  'reportTypes/Events_and_Event_Date.reportType',
  'reportTypes/Merchandise.reportType',
  'reportTypes/Promotion_Scales.reportType',
  'reportTypes/Ticket_Scales.reportType',
  'reportTypes/TourCampaignswithAdPlans.reportType',
  'reportTypes/Tour_Campaign_Ad_Plan.reportType',
  'reports/LNETourReports/Artist_Activity.report',
  'reports/LNETourReports/Artist_Headliner_Guarantees.report',
  'reports/LNETourReports/Artist_Hold.report',
  'reports/LNETourReports/Budget_Variance.report',
  'reports/LNETourReports/ConfirmedDeals.report',
  'reports/LNETourReports/Detailed_Deals.report',
  'reports/LNETourReports/Detailed_Ticket_Scale.report',
  'reports/LNETourReports/Net_Price_Average.report',
  'reports/LNETourReports/Offer_Financials.report',
  'reports/LNETourReports/Offer_Merchandise.report',
  'reports/LNETourReports/Offers.report',
  'reports/LNETourReports/On_Sale_Report.report',
  'reports/LNETourReports/Promotions_by_Ad_Plan.report',
  'reports/LNETourReports/TourCampaignswithAdPlans.report',
  'reports/LNETourReports/Tour_Tracking_Links.report',
  'reports/LNETourReports/Tour_Tracking_Links_Linked_on_Tour.report',
  'reports/LNETourReports/Venue_Oracle_Company_Information.report',
  'documents/path/to/mydocument.txt',
  'aura/LNE_LiveNationAPI_VenueSearch.aura',
  'classes/LNE_API_VenueSearchResp.cls',
  'classes/LNE_API_VenueSearchResp_Test.cls',
  'classes/LNE_API_VenueSearch_C.cls',
  'layouts/Account-Venue Page Layout.layout',
  'quickActions/Account.Find_LN_Vendor.quickAction'].join('\n');


//-- @TODO: do more than just poor man's integration test

describe('packageList/convertToPackage', function(done){
  
  it('runs command', function(done){
    this.timeout(10000);

    try {
      PackageListWriter.writeToPackageList(samplePackageListContents, targetPackageList)
        .then(function(){
          return ConvertToPackageCommand.run(context);
        })
        .then(function(){
          assert.equal(true,true, 'no exception should be thrown');
          fs.remove(targetPackageList, function(err){
            done();
          });
        })
        .catch(function(){
          assert.fail('no exceptions should be thrown when compressing');
          done();
        });
    } catch(err){
      assert.fail('exception happened while compressing:' + JSON.stringify(arguments));
    }
  });
});