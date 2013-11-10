/*global module:false, __dirname:false, require:false, process:false*/
var envs = require('./envs'),
	_ = require('underscore');

module.exports = function (grunt){

	var options = envs( grunt.option('production') ? 'production' : 'dev' );


	// Project configuration.
	grunt.initConfig({
		pkg: '<json:package.json>',
		docco: {
            examples: {
                src: [
                    'src/javascripts/examples/*.js',
                    'src/javascripts/examples/*.pde'
                ],
                options: {
                    output: 'docs/',
                    //make docco treat all files (.pde too) as javascript
                    extension: '.js',
                    template: 'src/views/docco.jst'
                }
            }
		},
		jshint: {
			all: [
				'Gruntfile.js',
                'app.js',
				'src/*.js',
				'src/javascripts/*.js',
				'src/javascripts/site/**/*.js',
                'src/javascripts/examples/*.js',
                'src/javascripts/extras/*.js'
			],
			options: {
				eqeqeq: true,
				immed: true,
				latedef: false,
				regexdash: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				globals: {
					jQuery: true,
					define: true,
					require: true,
					window: true,
					console: true,
					document: true
				}
			}
		},
		watch: {
            scripts: {
                files: ['src/javascripts/*.js', 'src/javascripts/**/*.js'],
                tasks: ['example']
            },
            jshint: {
                files: '<%= jshint.all %>',
                tasks: [ 'jshint' ]
            }
		},
		requirejs: {
			compile: {
				options: {
					appDir: "src/javascripts/",
					mainConfigFile: "./src/javascripts/config.js",
					baseUrl: "./vendor",
					dir: "src/javascripts-build/",
					//findNestedDependencies: true,
					optimize: (options.compress ? 'uglify' : 'none'),
					pragmasOnSave: {
						excludeJade: true
					},
					paths: {
                        'toxi': '../../../node_modules/toxiclibsjs/lib/toxi'
                    },
					modules: [
                        {
                            name: "jquery",
                            include: ['jquery', 'underscore', 'backbone']
                        },{
                            name: "main",
                            include: ['common'],
                            exclude: ['jquery', 'underscore', 'backbone']
                        },{
							name: "site/index",
							exclude: [ 'toxi', 'jquery', 'underscore', 'backbone' ]
						}
					]
				}
			}
		},
		//https://github.com/pifantastic/grunt-s3
		s3: {
			options: {
				key: options.s3.key,
				secret: options.s3.secret,
				bucket: options.s3.bucket,
				access: options.s3.access,
				maxOperations: 20
			},
			production: {
				// Files to be uploaded.
				upload: [{
					src: 'www/**/*',
					dest: '/',
					rel: 'www'
				},{
					src: 'src/images/*',
					dest: 'images/'
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-s3');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-docco');
	grunt.registerTask('default', ['docco','requirejs']);
	grunt.registerTask('production', function(){
		options = envs('production');
		grunt.task.run('docco','requirejs');
	});
	grunt.registerTask('deploy', function(){
		options = envs('production');
		grunt.task.run('production','s3:production');
	});

};
