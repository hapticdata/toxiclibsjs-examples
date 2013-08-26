/*global module:false, __dirname:false, require:false, process:false*/
var envs = require('./envs'),
	_ = require('underscore'),
	docco = require('docco'),
	requirejs = require('requirejs'),
	generateExamples = require('./tasks/example'),
	generatePages = require('./tasks/page'),
	siteMap;

requirejs.config({
	nodeRequire: require
});

console.log(requirejs.toUrl(__dirname + '/src/site'));
siteMap = requirejs(__dirname + '/src/site.js');

//docco needs to think .pde files are javascript
docco.languages[".pde"] = docco.languages[".js"];//{"name" : "javascript", "symbol" : "//"};


/**
 * Grunt process
 * The goal should be:
 * 1) Develop directly in the src/ directory
 * 2) Produce `staging` build that runs locally
 * 3) Produce `dist` build and `deploy` it across s3
 */
module.exports = function (grunt){

	var options = envs( grunt.option('production') ? 'production' : 'dev' );


	// Project configuration.
	grunt.initConfig({
		pkg: '<json:package.json>',
		meta: {
			banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
				' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
		},
		copy: {
			images: {
				files: [
					{expand: true, cwd: 'src/images/', src: ['**'], dest: 'www/images/'},
				]
			}
		},
		docco: {
			src: [
				'src/javascripts/examples/*.js',
				'src/javascripts/examples/*.pde'
			],
			options: {
				output: 'docs/',
				template: 'src/views/docco-template.jst'
			}
		},
		jshint: {
			all: [
				'Gruntfile.js',
				'src/*.js',
				'src/javascripts/*.js',
				'src/javascripts/**/*.js',
				'src/javascripts/site/**/*.js'
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
		less: {
			dev: {
				options: {
					paths: ["src/less"]
				},
				files: {
					"www/stylesheets/style.css": "src/less/style.less"
				}
			},
			production: {
				options: {
					paths: ["src/less"],
					yuicompress: true
				},
				files: {
					"dist/stylesheets/style.css": "src/less/style.less"
				}
			}
		},
		watch: {
			less: {
				files: [
					'src/less/*.less'
				],
				tasks: ['less:dev']
			},
			template: {
				files: [ 'app/templates/*.html'],
				tasks: ['template']
			}
		},
		requirejs: {
			compile: {
				options: {
					appDir: "src/javascripts/",
					mainConfigFile: "./src/javascripts/config.js",
					baseUrl: "./vendor",
					dir: "www/javascripts/",
					findNestedDependencies: true,
					optimize: (options.compress ? 'uglify' : 'none'),
					pragmasOnSave: {
						excludeJade: true
					},
					paths: {
						"site/map": "../../site"
					},
					modules: [
						{
							name: "site/index",
							include: [ "site/map" ],
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

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-s3');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-docco');
	grunt.loadNpmTasks('grunt-regarde');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');
	//grunt.loadNpmTasks('grunt-contrib-connect');

	/**
	 * custom grunt task to build an example
	 * _example:_ grunt generate-example:"Spherical Harmonics" or just grunt generate-example
	 * @param {Array|string} [exampleTitles] title(s) of examples to build
	 */
	grunt.registerTask('example', function (exampleTitles){
		var done = this.async();
		generateExamples(exampleTitles, options, done);
	});

	grunt.registerTask('page', function(pageTitles){
		generatePages( pageTitles, options, this.async() );
	});

	grunt.registerTask('default', ['copy:images','less:dev','docco','example','page','requirejs']);
	grunt.registerTask('production', function(){
		options = envs('production');
		grunt.task.run('docco','less:production','requirejs');
	});
	grunt.registerTask('deploy', function(){
		options = envs('production');
		grunt.task.run('production','s3:production');
	});

};
