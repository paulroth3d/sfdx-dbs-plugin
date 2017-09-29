# sfdx-dbs-plugins 

A collection of SalesForce DX CLI plugins by Paul Roth.

## Setup

### Install from source

1. Install the SDFX CLI.

2. Clone the repository: `git clone git@github.com:paulroth3d/sfdx-dbs-plugin.git`

3. Install npm modules: `npm install`

4. Link the plugin: `sfdx plugins:link .`

### Install as plugin

1. Install plugin: `sfdx plugins:install sfdx-dbs-plugin`

## Find last DX Error Line

Simple example: `sfdx dbs:lastLog`

Finds the last log line from the error log.

In other words, say you attempt to run `sfdx force:source:push` and need more info about the conflict.

Well, you're in luck!

Run: `sfdx dbs:log:latest` and you can see more about the results:

	When running as:proth-ltm8.internal.salesforce.com
	at 2017-09-11T21:24:38.074Z
	the following logs were found:

	{
	  "message": "Push failed.",
	  "status": 1,
	  "name": "DeployFailed",
	  "result": [
		{
		  "error": "TL_ProjectAssignmentView does not exist or is not a valid override for action View.",
		  "fullName": "TL_Project_Assignment__c",
		  "type": "CustomObject",
		  "filePath": "force-app/main/default/objects/TL_Project_Assignment__c.object-meta.xml",
		  "height": 1
		},
		{
		  "columnNumber": "15",
		  "lineNumber": "173",
		  "error": "Field $Setup.TL_Dynamic_Reports__c.TL_Assignment_Breakdown_Report__c does not exist. Check spelling. (173:15)",
		  "fullName": "TL_Project_Assignment__c.Assignment_Report",
		  "type": "WebLink",
		  "filePath": "N/A",
		  "height": 1
		}
	  ],
	  "warnings": []
	}

**Please note: This is assumed to be at: USER_HOME_DIR/.sfdx/sfdx.log. Please see [here](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_cli_log_messages.htm) for more information**/

# Commands to implement

*	Doc
	*	Matrix Reports
		*	Profile / Permission Set by Apex Class
		*	Profile / Permission Set by VF Page
		*	Profile / Permission Set by Object
		*	Profile / Permission Set by Field
		*	Profile / Permission Set by Layout
		*	Profile / Permission Set by Record Type
	*	Code
	*	Workflows
	*	Flows
	*	Objects (as documentation pages)
	*	Object Workbooks (as excel sheets)
	*	Profiles
*	packageList
	*	make package list all
	*	create revision list
	*	add file to package list
	*	add to package list
		*	from local file
		*	searching local files
		*	searching metadata
		*	manual
	*	remove from package list
		*	manual
		*	search
	*	combine package lists
	*	subtract package lists (ignore lists)
	*	apply package list to package
	*	refresh from list
	*	deploy from list
*	package
  *	add package member
  *	add package type
  *	add all package types
  *	add standard objects
  *	add documentation metadata
  *	add profile metadata
  *	add permission set metadata
  *	remove package member
  *	apply package to package list
  *	refresh
  *	deploy
