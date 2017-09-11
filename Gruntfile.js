/**
 * The configuration for Grunt
 **/
module.exports = function(grunt){
	
	grunt.initConfig({
		eslint: {
			commands: {
				src: ['commands/**/*.js'],
				options: {
					configFile: './.eslintrc.js'
				}
			},
			test: {
			  src: ['test/**/*.js'],
				options: {
					configFile: './.eslintrc.js'
				}
			}
		},
		mochaTest: {
		  test: {
		    options: {
		      reporter: 'spec',
		      quiet: false,
		      clearRequireCache: true,
		      noFail: false
		    },
		    src: [
		      'test/**/*.js'
		    ]
		  }
		},
		watch: {
			commands: {
			  files: ['commands/**/*'],
			  tasks: ['default'],
			  options: {
			    spawn: false
			  }
			},
			test: {
			  files: ['commands/**/*', 'test/**/*'],
			  tasks: ['test'],
			  options: {
			    spawn: false
			  }
			}
		}
	});
	
	grunt.loadNpmTasks('gruntify-eslint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-mocha-istanbul');
	
	grunt.registerTask('default',['eslint']);
	grunt.registerTask('lintCommands',['eslint:commands']);
	grunt.registerTask('test', ['eslint','mochaTest']);
	grunt.registerTask('watchCommands',['watch:commands']);
};