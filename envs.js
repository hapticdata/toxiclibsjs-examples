/*global __dirname,process*/
var fs = require('fs'),
	_ = require('underscore');

/**
 * Various credentials and other protected information
 */
exports = module.exports = function( env ){
	env = env || process.env.NODE_ENV;
	var cred, creds;
	creds = {
		defaults: {
			s3: {
				key: '######',
				secret: '###########',
                bucket: 'toxiclibsjs',
                access: 'public-read'
            },
			baseUrl: 'src/',
			dest: 'www/',
			layout: 'src/views/layout.jade',
			examples: 'javascripts/examples/',
			//the root location of the site
			root: '/',
			pretty: true,
			compress: false

		},
		dev: {
			//the root location for the static assets over http
            staticUrl: '/',
			root: '/',
			//the hard-disk location of static files to serve during development
            staticDir: 'www/'
		},
		staging: {
			staticUrl: '/',
			staticDir: 'dist/'
		},
		production: {
            staticUrl: 'http://s3.amazonaws.com/toxiclibsjs/',
			//the root location of the site
			root: '/toxiclibsjs/',
			//the hard-disk location of files to upload to s3
            staticDir: 'dist/',
			compress: true
		}
	};

	cred = creds[env];

	return _.defaults( creds[env], creds.defaults );
};