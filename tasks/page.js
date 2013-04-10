var fs = require('fs'),
	jade = require('jade'),
	async = require('async'),
	_ = require('underscore'),
	requirejs = require('requirejs'),
	utils = require('./utils'),
	getPagesToGenerate,
	generatePage,
	siteMap;

requirejs.config({ nodeRequire: require });
siteMap = requirejs(__dirname+'/../' + '/src/site.js');


generatePage = function(page, options, callback){

	var read = utils.read(options),
		write = utils.write(options);

	var locals = {
		pretty: options.pretty,
		layout: true,
		title: page.title + ' - Toxiclibs.js',
		options: page.options || {},
		dependencies: page.dependencies,
		siteUrl: options.siteUrl,
		staticUrl: options.staticUrl
	};

	var tmplOpts = {
		filename: options.layout,
		pretty: options.pretty,
		siteUrl: options.siteUrl,
		staticUrl: options.staticUrl
	};

	var template = read.template( page.template );
	var fn = jade.compile(template, tmplOpts);
	console.log('Page: ', locals.title);
	var output = fn(locals);
	write.template(page.out, output, callback);
};


module.exports = function( pageTitles, options, callback ){
	var pages = utils.parseArguments( 'pages',pageTitles );
	async.forEach(pages, function (pg, cb){
		generatePage(pg, options, cb);
	}, callback);
};