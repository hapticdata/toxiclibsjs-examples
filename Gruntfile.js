/*global module:false, __dirname:false, require:false, process:false*/
var envs = require('./envs'),
    _ = require('underscore');

module.exports = function (grunt){

    var options = envs( grunt.option('production') ? 'production' : 'dev' );

    var toxiclibsjs = 'node_modules/toxiclibsjs/';


    // Project configuration.
    grunt.initConfig({
        pkg: '<json:package.json>',
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
                    preserveLicenseComments: false,
                    mainConfigFile: "./src/javascripts/config.js",
                    baseUrl: "./",
                    dir: "javascripts-build/",
                    //findNestedDependencies: true,
                    optimize: 'uglify', //(options.compress ? 'uglify' : 'none'),
                    pragmasOnSave: {
                        excludeJade: true
                    },
                    paths: {
                        'toxi': '../../' + toxiclibsjs + 'lib/toxi'
                    },
                    modules: [
                        {
                            name: "jquery",
                            include: ['jquery', 'underscore', 'backbone']
                        },
                        {
                            name: "dat/gui/GUI",
                            include: ["dat/gui/GUI"]
                        },
                        {
                            name: "toxi",
                            include: [ "toxi" ]
                        },
                        {
                            name: "main",
                            //include: ['common'],
                            exclude: ['jquery', 'underscore', 'backbone']
                        },{
                            name: "site/index",
                            exclude: [ 'toxi', 'dat/gui/GUI', 'toxi', 'jquery', 'underscore', 'backbone' ]
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
                upload: [
                    //all of the built javascript files are served on s3
                    {
                        src: 'javascripts-build/**/*.{js,pde}',
                        dest: 'javascripts/',
                        rel: 'javascripts-build/',
                        options: { gzip: true }
                    },
                    //all of the images of the site are served on s3
                    {
                        src: 'src/images/*',
                        dest: 'images/'
                    },
                    //all of the toxiclibjs modules get uploaded for AMD-examples to use
                    {
                        src: toxiclibsjs + '/**/*.js',
                        dest: 'toxiclibsjs/',
                        rel: toxiclibsjs,
                        options: { gzip: true }
                    }
                ]
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
        grunt.task.run('requirejs');
    });
    grunt.registerTask('deploy', function(){
        options = envs('production');
        grunt.task.run('production','s3:production');
    });

};
