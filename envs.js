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
    githubExamples: 'https://github.com/hapticdata/toxiclibsjs-examples/blob/develop/src/javascripts/examples/',
    //the root location of the site
    rootUrl: '/',
    pretty: true,
    port: 3004,
    compress: false
};

creds = {
    dev: {
        //the root location for the static assets over http
        staticUrl: '/',
        //the hard-disk location of static files to serve during development
        staticDir: 'src/'
    },
    staging: {
        staticUrl: '/',
        staticDir: 'dist/'
    },
    production: {
        staticUrl: 'http://s3.amazonaws.com/toxiclibsjs/',
        toxiclibsjsBuildUrl: 'http://s3.amazonaws.com/toxiclibsjs/toxiclibsjs/build/toxiclibs.min.js',
        //the root location of the site
        rootUrl: '/toxiclibsjs/',
        //the hard-disk location of files to upload to s3
        staticDir: 'dist/',
        compress: true
    }
};

/**
 * Various credentials and other protected information
 */
exports = module.exports = function( env, config ){
    env = env || process.env.NODE_ENV;
    return _.defaults( _.defaults(creds[env], config || {}), defaults );
};

