/*global __dirname,process*/
var fs = require('fs'),
    _ = require('underscore'),
    defaults,
    creds;


//all configurations
defaults = {
    s3: {
        key: process.env.S3_KEY,
        secret: process.env.S3_SECRET,
        bucket: 'toxiclibsjs',
        access: 'public-read'
    },
    doccoPath: 'generated/docs/',
    stylesheetsPath: 'generated/stylesheets/',
    baseUrl: 'src/',
    toxiclibsjsBuildUrl: '/toxiclibsjs/build/toxiclibs.js',
    toxiclibsjsDir: 'node_modules/toxiclibsjs/',
    layout: 'src/views/layout.jade',
    examples: 'src/javascripts/examples/',
    githubExamples: 'https://github.com/hapticdata/toxiclibsjs-examples/blob/master/src/javascripts/examples/',
    //the root location of the site
    rootUrl: '/',
    //the hard-disk location of static files to serve during development
    staticDir: 'src/',
    //pretty-type the html
    pretty: true,
    //port to run server on
    port: 3004
};

creds = {
    dev: {
        //the root location for the static assets over http
        staticUrl: '/',
        toxiclibsjsBuildUrl: 'http://s3.amazonaws.com/toxiclibsjs/toxiclibsjs/build/toxiclibs.min.js',
    },
    staging: {
        staticUrl: '/',
        staticDir: 'dist/'
    },
    production: {
        //in production load all static assets off s3,
        staticUrl: 'http://s3.amazonaws.com/toxiclibsjs/',
        //also load the minified toxiclibs
        toxiclibsjsBuildUrl: 'http://s3.amazonaws.com/toxiclibsjs/toxiclibsjs/build/toxiclibs.min.js',
        //the site is hosted in this sub-directory of haptic-data.com
        rootUrl: '/toxiclibsjs/',
        compress: true
    }
};

/**
 * Various credentials and other protected information
 */
exports = module.exports = function( env, config ){
    env = env || process.env.NODE_ENV;

    if (env !== 'staging' && env !== 'production') {
        env = 'dev';
    }

    return _.defaults( _.defaults(creds[env], config || {}), defaults );
};
