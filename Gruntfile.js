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
		watch: {
			commands: {
			  files: ['commands/**/*'],
			  tasks: ['default'],
			  options: {
			    spawn: false
			  }
			}
		}
	});
	
	grunt.loadNpmTasks('gruntify-eslint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	grunt.registerTask('default',['eslint']);
	grunt.registerTask('lintCommands',['eslint:commands']);
	grunt.registerTask('watchCommands',['watch:commands']);
};