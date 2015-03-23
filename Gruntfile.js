module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
	config: {
        // Configurable paths
        app: 'app'
    },
    pkg: grunt.file.readJSON('package.json'),
	bowercopy: {
        options: {
            // Task-specific options go here
        },
        js: {
            options: {
                destPrefix: 'public/js/libs'
            },
            files: {
                'jquery.js': 'jquery/dist/jquery.js',
                'angular.js': 'angular/angular.js',
				'angular.localStorage.js': 'angularLocalStorage/src/angularLocalStorage.js',
				'angular.rangeSlider.js': 'angular-rangeslider/angular.rangeSlider.js',
				'angular-ui-router.min.js': 'angular-ui-router/release/angular-ui-router.js'
            },
        },
		css: {
			options: {
                destPrefix: 'public/css/libs'
            },
			files: {
				'angular.rangeSlider.css': 'angular-rangeslider/angular.rangeSlider.css',
				'bootstrap.css': 'bower_components/bootstrap/dist/css/bootstrap.css',
			}
		}
    },
	less: {
		development: {
			options: {
				  compress: true,
				  yuicompress: true,
				  optimization: 2
			},
			files: {
				"public/css/forecast.css": "public/css/forecast.less" // destination file and source file
			}
		}
    },
	concat: {
		options: {
			separator: ';\n'
		},
		css: {
			src: ['public/css/**/*.css'],
			dest: 'public/build/css/bundle.css'
		},
		js: {
			src: ['public/js/libs/jquery.js', 'public/js/libs/angular.js', 'public/js/**/*.js'],
			dest: 'public/build/js/output.js'
		}
	},
	uglify: {
		my_target: {
			options: {
				sourceMap: true
			},
			files: { 'public/js/output.min.js': ['public/js/libs/jquery.js', 'public/js/libs/angular.js', 'public/js/**/*.js'] }
		}
	},
	watch: {
		options: {
			livereload: true
		},
		css: { 
			files: ['public/css/**/*.less'],
			tasks: ['less', 'concat:css']
		},
		js: { 
			files: ['public/js/**/*.js'],
			tasks: ['concat:js']
		}
	},
	connect: {
        options: {
            port: 9000,
            livereload: 35729,
            hostname: 'localhost'
        },
        livereload: {
            options: {
                open: true,
                base: 'public'
            }
        },
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bowercopy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
 
  grunt.registerTask('serve', function (target) {
    grunt.task.run([
		'prepare',
        'connect:livereload',
        'watch'
        ]);
    });
  // Default task(s).
  grunt.registerTask('prepare', ['bowercopy', 'less', 'concat' /*'uglify',*/]);

};