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

**Please note: This is assumed to be at: USER_HOME_DIR/.sfdx/sfdx.log. Please see [here](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_cli_log_messages.htm) for more information**/
