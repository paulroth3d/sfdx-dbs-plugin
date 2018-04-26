/*jshint esversion: 6*/

const _ = require('underscore');
const Q = require('q');
const chokidar = require('chokidar'); //-- used for file monitoring
const fs = require('fs-extra'); //-- supports promises
const child_process = require('child_process');
const PATH = require('path');

/**
 * Prompts for specific information about the metadata API
 * 
 * @class LightningLintWatcher
 */
class LightningLintWatcher {

  constructor(){
    /**
     * The file watcher
     */
    this.watcher = null;
    
    /**
     * Full path to run against
     */
    this.fullPath = null;

    /**
     * Config to use when watching or running linter
     */
    this.config = null;
  }

  /**
   * Validates the target folder
   * @param targetDirectory (String) - path to watch
   * @return (boolean) - exists (true) or not (false)
   */
  validateTargetDirectory(targetDirectory){
    return !fs.existsSync(targetDirectory);
  }

  /**
   * Runs the lightning linter
   * @param targetPath (String) - path to run the linter
   * @param config {object} - collection of arguments sent
   */
  runLinter(targetPath, config){
    const deferred = Q.defer();

    if( config.runAllOnChange ){
      targetPath = config.targetDirectory;
    }

    let runCommand = `sfdx force:lightning:lint ${targetPath}`;
    if( config.ignorePattern ){
      runCommand += ` --ignore "${config.ignorePattern}"`;
    }
    if( config.filePattern ){
      runCommand += ` --files "${config.filePattern}"`;
    }
    if( config.verbose ){
      runCommand += ' --verbose';
    }

    console.info('\nNow running:\n' + runCommand);
    child_process.exec(runCommand, function(err, stdout){
      if (err){
        deferred.reject('Error occurred while running lightning linter:' + runCommand);
        return;
      }
      console.info(stdout);
      deferred.resolve();
    });

    return deferred.promise;
  }

  /**
   * Start watching on a given folder
   * @param targetDirectory (String) - path to the base folder to watch
   * @memberof LightningLintWatcher
   */
  startWatch(config){
    const deferred = Q.defer();
    const self = this;
    const targetDirectory = config.dir;

    if( this.validateTargetDirectory(targetDirectory) ){
      deferred.reject('target directory does not exist');
      return deferred.promise;
    }
    
    //-- watch any javascript files
    var watchPath = PATH.join(targetDirectory, '**', '*.js');

    this.config = _.defaults({
      ignorePattern: config.ignorePattern ? config.ignorePattern : null,
      verbose: config.verbose ? config.verbose : null,
      filePattern: config.filePattern ? config.filePattern : null,
      runAllOnChange: config.runAllOnChange ? config.runAllOnChange : null,
      watchPath: watchPath,
      targetDirectory: targetDirectory
    });

    this.watcher = chokidar.watch(this.config.watchPath, {
    });

    this.watcher
      .on('change', (path, stats) => {
        debugger;
        var parsedPath = PATH.parse(path);
        if(self.config.verbose){
          console.log(`File ${path} has changed`);
        }
        self.runLinter(parsedPath.dir, self.config)
          .then( function(successMsg){
            //console.info('linting complete');
          })
          .catch( function(errMsg){
            console.error('Linter could not run');
            console.error(errMsg);
            debugger;
          });
      });
    
    //-- notify the user of the types of files to watch
    console.info('Now watching: ' + this.config.watchPath);

    return deferred.promise;
  }
}

module.exports = LightningLintWatcher;
