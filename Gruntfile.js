/*global module:false, __dirname:false, require:false, process:false*/
var _ = require('underscore'),
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


module.exports = function (grunt){

	var options = {
		pretty: true,
		compress: false,
		siteUrl: '/toxiclibsjs/',
		staticUrl: '/toxiclibsjs/',
		baseUrl: '/src/',
		css: __dirname + '/www/stylesheets/',
		html: __dirname + '/www/'
	};

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
		docco: {
			dev: {
				src: [
					'src/javascripts/examples/*.js',
					'src/javascripts/examples/*.pde'
				],
				options: {
					output: 'docs/',
					template: 'src/views/docco-template.jst'
				}
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
					"www/stylesheets/style.css": "src/less/style.less"
				}
			}
		},
		//regarde is watch but fancier
		regarde: {
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
		connect: {
			server: {
				options: {
					port: 8000,
					base: 'app',
					keepalive: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-docco');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-regarde');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	//grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.registerTask('watch', ['regarde']);

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

	grunt.registerTask('default', ['less:dev','docco:dev','example','page','requirejs']);

};