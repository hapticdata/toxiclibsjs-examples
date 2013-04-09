var fs = require('fs'),
	jade = require('jade'),
	async = require('async'),
	_ = require('underscore'),
	requirejs = require('requirejs'),
	getPagesToGenerate,
	generatePage,
	siteMap;

requirejs.config({ nodeRequire: require });
siteMap = requirejs(__dirname+'/../' + '/src/site.js');

/**
 * get the objects out of the siteMap just for the pages we are going
 * to generate on this invocation
 * @param {Array|string} [pageTitles] title(s) of pages to build
 * @returns {Array} of complete objects for each template
 */
getPagesToGenerate = function (pageTitles){
	var pages = [];
	if (!pageTitles){
		pageTitles = _.pluck(siteMap.pages, 'title');
	}
	//ensure we get an array
	if (pageTitles && !Array.isArray(pageTitles)){
		pageTitles = [pageTitles];
	}

	pageTitles.forEach(function (ex){
		var page = _(siteMap.pages).findWhere({ title: ex });
		pages.push(page);
	});
	return pages;
};

generatePage = function(page, options, callback){
	function layout(){
		return __dirname +'/../'+ options.baseUrl + 'views/layout.jade';
	}

	var getTemplate = function (tmpl){
		var pth = __dirname +'/../'+ options.baseUrl + 'views/';
		if (tmpl === undefined || tmpl === ''){
			return pth;
		}
		if (tmpl.split('.').length === 1){
			tmpl = tmpl + '.jade';
		}
		return fs.readFileSync(pth + tmpl);
	};

	//get the file location for where the example should be written
	var getDestination = function (out){
		return options.html + out.split('.')[0] + '.html';
	};
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
		filename: layout(),
		pretty: options.pretty,
		siteUrl: options.siteUrl,
		staticUrl: options.staticUrl
	};

	var template = getTemplate( page.template );
	var fn = jade.compile(template, tmplOpts);
	console.log('Page: ', locals.title);
	var output = fn(locals);
	fs.writeFile( getDestination(page.out), output, callback);
};


module.exports = function( pageTitles, options, callback ){
	var pages = getPagesToGenerate(pageTitles);
	async.forEach(pages, function (pg, cb){
		generatePage(pg, options, cb);
	}, callback);
};