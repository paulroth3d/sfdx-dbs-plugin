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

## Salesforce Retrieve and Deploy Steps

### Uncompress a folder

This is quite helpful when unpacking a metadata retrieve from Salesforce DX.

	sfdx force:mdapi:retrieve \
		-k path/to/package.xml \
		-r target/path \
		-u userAlias
		
	# results in target/path/unpackaged.zip
	
An example to uncompress the folder:

	sfdx dbs:zip:uncompress \
		--source target/path/unpackaged.zip \
		--replace
	
	# unzips the files to: ./target/path
	# and removes target/path/unpackaged.zip
	# (because -r / --remove was sent)

It takes three arguments:

* --source / -s : path to the zip file to be unzipped
* --target / -t : path to the folder to unzip to (existing or not) <br /> ***(defaults to the same folder as source)***
* --remove / -r : whether to remove the zip file on complete

### Zip Compress a folder (for deployment)

To zip that resulting folder, use the command:

	sfdx dbs:zip:compress:dir \
		--source target/path
	
Takes three arguments:

* --source / -s : path of the directory to compress
* --target / -t : [[ optional ]] path for resulting zip <br /> ***(defaults to sourcePath + '.zip')***

Once the zip file is completed, it can be deployed using standard Salesforce DX

	sfdx force:mdapi:deploy \
		-f target/path.zip \
		-u userAlias \
		-w 100

## Listing Salesforce Metadata

Sometimes it is helpful to know what types of metadata is available.

With this command, you can determine the possible Apex Types, or list metadata under those types (even using a filter)

	sfdx dbs:list:fromOrg -a userAlias
	
	# displys the lists of all MetadataTypes available for that org
	# and upon entering the prompt
	# then lists all metadata under that MetadataType
	
It accepts the following arguments:

*  -a, --alias ALIAS    Connection alias
*  -f, --folder FOLDER  Folder within the type to search <br /> **(only needed for Folder/* types)**
*  -y, --type TYPE      Metadata API Type (do not specify to list all)

Note that this becomes possible to list all Documents, for example, by running this command first:

	sfdx dbs:list:fromOrg -a userAlias \
		--type DocumentFolder
	
	# provides a list of Document folders within the org
	# choosing one, say 'public-documents'
	# we can get a list of all documents
	# under the 'public-documents' folder
	
	sfdx dbs:list:fromOrg -a userAlias \
		--type Document \
		--folder public-documents
		
	# list of all documents under public-documents
	


