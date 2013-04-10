var fs = require('fs'),
	async = require('async'),
	jade = require('jade'),
	requirejs = require('requirejs'),
	_ = require('underscore'),
	utils = require('./utils'),
	generateExample;




generateExample = function( example, options, callback ){

	var read = utils.read(options),
		write = utils.write(options);

	if( example.template === undefined ){
		example.template = "index";
	}

	var exampleSource = read.example( example.src ),
		template = read.template( example.template );

	var locals = {
		siteUrl: options.siteUrl,
		staticUrl: options.staticUrl,
		pretty: options.pretty,
		layout: true,
		title: example.title + ' - Toxiclibs.js',
		script: '\n'+exampleSource,
		name: example.title,
		src: example.src,
		options: example.options || {},
		dependencies: example.dependencies,
		pagelet: read.docco( example.src )
	};


	var tmplOpts = {
		filename: options.layout,
		pretty: options.pretty,
		siteUrl: options.siteUrl,
		staticUrl: options.staticUrl
	};

	var fn = jade.compile(template, tmplOpts );
	console.log( 'Example: ', locals.title );
	var output = fn(locals);
	write.template( example.src, output, callback );
};

/**
 * Generate examples for each title passed in,
 * grab its docco and its jade template and compile
 */
module.exports = function( exampleTitles, options, callback ){
	var examples = utils.parseArguments( 'examples', exampleTitles );
	async.forEach( examples, function( ex, cb ){
		generateExample( ex, options, cb);
	}, callback );
};

