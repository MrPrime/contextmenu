module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> - <%= pkg.author %> - <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files:{
					'js/<%= pkg.name %>.min.js': ['js/<%= pkg.name %>.js']
				}
			}
		},
		cssmin: {
			compress: {
				files: {
					'css/<%= pkg.name %>.min.css': ['css/<%= pkg.name %>.css']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	grunt.registerTask('default', ['uglify', 'cssmin']);
};