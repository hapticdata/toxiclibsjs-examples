var fs = require('fs'),
	async = require('async'),
	jade = require('jade'),
	requirejs = require('requirejs'),
	_ = require('underscore'),
	siteMap,
	getExamplesToGenerate,
	generateExample,
	getDoccoPagelet,
	getExampleSource,
	getDestination,
	getTemplate;

requirejs.config({ nodeRequire: require });
siteMap = requirejs(__dirname+'/../src/site.js');

//get the contents of the generated docco example
getDoccoPagelet = function( src ){
	console.log('src: ', src);
	return fs.readFileSync(__dirname + '/../docs/'+src.split('.')[0]+'.html');
};


/**
 * get the objects out of the siteMap just for the examples we are going
 * to generate on this invocation
 * @param {Array|string} [exampleTitles] title(s) of examples to build
 * @returns {Array} of complete objects for each template
 */
getExamplesToGenerate = function( exampleTitles ){
	var examples = [];
	if( !exampleTitles ){
		exampleTitles = _.pluck(siteMap.examples, 'title');
	}
	//ensure we get an array
	if( exampleTitles && !Array.isArray(exampleTitles) ){
		exampleTitles = [exampleTitles];
	}

	exampleTitles.forEach(function( ex ){
		var example = _(siteMap.examples).findWhere({ title: ex });
		examples.push( example );
	});
	return examples;
};


generateExample = function( example, options, callback ){
	function layout(){  return __dirname+'/../'+options.baseUrl+'views/layout.jade'; }
	getTemplate = function( tmpl ){
		var pth = __dirname+'/../' +options.baseUrl+'views/';
		if( tmpl === undefined || tmpl === '' ){
			return pth;
		}
		if (tmpl.split('.').length === 1 ) {
			tmpl = tmpl + '.jade';
		}
		return fs.readFileSync(pth+tmpl);
	};

	//get the file location for where the example should be written
	getDestination = function( out ){
		return options.html+out.split('.')[0]+'.html';
	};

	//get the example's js/pde source
	getExampleSource = function( src ){
		return fs.readFileSync(__dirname+'/../' +options.baseUrl+'javascripts/examples/'+src);
	};

	if( example.template === undefined ){
		example.template = "index";
	}
	console.log('about to load ');
	var exampleSource = getExampleSource( example.src ),
		outputDestination =  getDestination( example.src ),
		template = getTemplate( example.template );

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
		pagelet: getDoccoPagelet( example.src )
	};


	var tmplOpts = {
		filename: layout(),
		pretty: options.pretty,
		siteUrl: options.siteUrl,
		staticUrl: options.staticUrl
	};

	var fn = jade.compile(template, tmplOpts );
	console.log( 'Example: ', locals.title );
	var output = fn(locals);
	fs.writeFile( outputDestination, output, callback );
};

/**
 * Generate examples for each title passed in,
 * grab its docco and its jade template and compile
 */
module.exports = function( exampleTitles, options, callback ){
	var examples = getExamplesToGenerate( exampleTitles );
	async.forEach( examples, function( ex, cb ){
		generateExample( ex, options, cb);
	}, callback );
};

