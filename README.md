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
	
## Chunking Package Types

When documenting your Salesforce Org, it is possible to retrieve some sets of metadata using the `*` member within your package.

Others you need to write explicitly.

**Please note: The MetadataTypes that must be asked for explicitly can be found by running the command `sfdx dbs:list:allTypes -a userAlias`. All types suffixed (ending with) a star `*` are Folder types that must be explicitly asked for by name**

At present these are:

* Dashboard
* Document
* EmailTemplate
* Report

This can be a challenge to determine exactly which records are held.

Furthermore, the Metadata API utilizes [Governor Limits](https://developer.salesforce.com/docs/atlas.en-us.salesforce_app_limits_cheatsheet.meta/salesforce_app_limits_cheatsheet/salesforce_app_limits_platform_metadata.htm) both for the number of files (currently 10,000) and the total amount of data retrieved (currently 39MB)


We created the following command to generate packages for you for any Metadata type that utilizes folders.

For example, to retrieve all Documents for a given org:

	sfdx dbs:package:chunk \
		--folderType DocumentFolder \
		--memberType Document \
		--target path/for/packages \
		--userAlias myUserAlias
	
	# for my org, because there are 15,678 documents
	# this generates the following files:
	# path/for/packages/package_0001.xml (the first 10,000 members)
	# path/for/packages/package_0002.xml (the remaining 5,678 members)

This will generate packages for all Document members (from all `DocumentFolder`s within the org) with at most 10,000 members in each package.

The command supports the following flags:

*  -f, --folderType FOLDERTYPE  Metadata API type for folders <br />
(ex: DocumentFolder, EmailFolder, etc)
*  -m, --memberType MEMBERTYPE  Metadata API type for the documents <br /> (within those folders)
*  -t, --target TARGET          Target folder to place the resulting files
* -u, --userAlias USERALIAS    Connection Alias to pull against

*  -a, --apiVersion APIVERSION  API version to use
*  -s, --chunkSize CHUNKSIZE    Max number of documents per file
* -p, --prefix PREFIX          Prefix for packages generated

Although this list may grow, this is the list of all Metadata types (and their folder type equivalents currently known.

<table>
	<tr><th>MemberMetadataType</th><th>FolderMetadataType</th></tr>
	<tr><td>Dashboard</td><td>DashboardFolder</td></tr>
	<tr><td>Document</td><td>DocumentFolder</td></tr>
	<tr><td>EmailTemplate</td><td>EmailFolder</td></tr>
	<tr><td>Report</td><td>ReportFolder</td></tr>
</table>

An additional example, this is how to retrieve all Reports:

	sfdx dbs:package:chunk \
		--folderType ReportFolder \
		--memberType Report \
		--target path/for/packages \
		--userAlias myUserAlias \
		--chunkSize 5000 \
		--prefix 05_reports
		
	# generates:
	# ./path/for/packages/05_reports_0001.xml
	# ./path/for/packages/05_reports_0002.xml
	# ./path/for/packages/05_reports_0003.xml
	# ./path/for/packages/05_reports_0004.xml
	# ./path/for/packages/05_reports_0005.xml

For further reading, see here for listing documents
[https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_document.htm](https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_document.htm)

# Continuously Lightning Lint

One of the challenges with `sfdx force:lightning:lint` is being consistent - and always running it before committing.

The goal of `sfdx dbs:watch:lightning -d force-app` (for example) is that it will re-run the lightning:lint when you save your files.

By default, it will only lint on the individual component you're working on (but you can have it re-run against all files if you provide the `--runAllOnChange` or `-r` parameter)

parameters:

* -d --dir (String - required) - the path to the directory to watch (ex: force-app)
* -v --verbose (flag) - runs the linter in verbose mode (includes style checks)
* -r --runAllOnChange (flag) - lints all components on save (true) or only the component changed (false - default)
* -f --filePattern PATTERN (String) - passed through to the --files parameter of lightning lint. Pattern of files to lint.
* -i --ignorePattern PATTERN (String) - passed through to the --ignore parameter of lightning lint. Pattern of files to ignore.

Example:

	#-- watches the folder (at relative path ./force-app) in verbose mode
	sfdx dbs:watch:lightning -d force-app -v
	
	#-- When making a change, all components (not just the component changed) will be linted
	sfdx dbs:watch:lightning -d force-app -r
