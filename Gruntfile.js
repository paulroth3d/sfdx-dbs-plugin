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
			}
		}
	});
	
	grunt.loadNpmTasks('gruntify-eslint');
	
	grunt.registerTask('default',['eslint']);
};