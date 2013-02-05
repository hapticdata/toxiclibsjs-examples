/*global __dirname, console, process*/

//#Toxiclibs.js site build
//`node build` to build a new copy of the site
//`node build --watch` to auto-rebuild each time a template or less changes

require('colors');

var jade = require('jade'),
	less = require('less'),
	requirejs = require('requirejs'),
	wrench = require('wrench'),
	docco = require('docco'),
	async = require('async'),
	fs = require('fs');


var options = {
	pretty: true,
	compress: false,
	baseUrl: '/src/',
	css: __dirname + '/www/stylesheets/',
	html: __dirname + '/www/'
};

requirejs.config({
	nodeRequire: require
});
//docco needs to think .pde files are javascript
docco.languages[".pde"] = docco.languages[".js"];//{"name" : "javascript", "symbol" : "//"};


//utilities for looking up paths
function config() { return requirejs('./src/site'); }
function scripts( src ){ return __dirname+options.baseUrl+'javascripts/'+src; }
function source( src ){ return __dirname +options.baseUrl+'javascripts/examples/'+src; }
function styles( src ){ return __dirname +options.baseUrl+'less/'+src; }
function view( tmpl ){
	var pth = __dirname +options.baseUrl+'views/';
	if( tmpl === undefined || tmpl === '' ){
		return pth;
	}
	if (tmpl.split('.').length === 1 ) {
		tmpl = tmpl + '.jade';
	}
	return pth+tmpl;
}
function html( out ){ return options.html+out.split('.')[0]+'.html'; }
function layout(){  return __dirname+options.baseUrl+'views/layout.jade'; }
function pagelet( src ){ return __dirname + '/docs/'+src.split('.')[0]+'.html'; }

function time( ){
	var dt = new Date();
	return [ dt.getHours(), dt.getMinutes(), dt.getSeconds()].join(':').red;
}

function msg( args ){
	args = Array.prototype.slice.call(arguments, 0);
	args.unshift( time() );
	console.log.apply( console.log, args );
}

console.log("scripts: "+ scripts('') );
if (process.argv[2] === '--watch'){
	watchThenDo( styles(''), compileLess );
	watchThenDo( view(''), compileTemplates );
	watchThenDo( source(''), compileTemplates );
	watchThenDo([
		scripts(''),
		scripts('site/'),
		scripts('site/models/'),
		scripts('site/views/'),
		scripts('site/collections/')
	], compileScripts );

} else {
	compileLess('less/');
	compileTemplates();
	compileScripts();
}

function watchThenDo( directories, tasks, callback ){
	if( !Array.isArray( directories ) ){
		directories = [directories];
	}
	if( ! Array.isArray( tasks ) ){
		tasks = [tasks];
	}
	msg('directories: ', directories );
	directories.forEach(function( dir ){
		fs.readdir( dir, function( err, files ){
			if( err ) {
				if( callback ) callback( err );
				else msg( err );
				return;
			}
			files.forEach(function( file ){
				var filepath = dir + file;
				msg('watching file: ', filepath );
				fs.watchFile( filepath, {persistent: true}, function(){
					msg('file: ', file );

					tasks.forEach(function( task ){
						task( dir , file );
					});
				});
			});
		});
	});
}
function compileLess(){
	fs.readFile( styles('style.less'), {encoding: 'utf8'}, function( err, body ){
		if( err ) throw err;
		body = String(body);
		var parser = new(less.Parser)({
			paths: [ styles('') ],
			filename: styles('style.less')
		});

		parser.parse( body, function( err, tree ){
			if( err ){
				msg('LESS Error: ', err );
				return;
			}
			var css;
			try {
				css = tree.toCSS({ compress: options.compress });
			} catch( e ){
				msg('Less Error: ', e );
				return;
			}
			fs.writeFile( options.css + 'style.css', css, function( err ){
				if( err ) throw err;
				msg('wrote style.css');
			});
		});


		/*less.render( body, function( err, css ){
			if( err ) throw err;
			fs.writeFile( options.css + 'style.css', css, function( err ){
				if( err ) throw err;
				msg('wrote style.css');
			});
		});*/
	});
}


//re-render all templates and docco
function compileTemplates(){
	var siteMap =  config();//JSON.parse( fs.readFileSync( config() ) );

	//generate paths to the example sources
	var sources = [];
	siteMap.examples.forEach(function( example ){
		sources.push( source( example.src ) );
	});
	//pass to docco, then jade, then clean up
	docco.document(sources, { language: "javascript", template: view("docco-template.jst") }, function( err ){
		if( err ) throw err;
		async.forEach( siteMap.examples, generateExample, function exit( err ) {
			if( err ) throw err;
			setTimeout(function(){
				//clean();
			}, 500);
		});
	});

	//handle pages
	siteMap.pages.forEach(function( page ){
		generatePage( page );
	});


	//remove the docs folder
	function clean(){
		wrench.rmdirRecursive( __dirname + '/docs/', function(){
			msg('docs deleted');
		});
	}
}




function generateExample( example, callback ){

	if( example.template === undefined ){
		example.template = "index";
	}
	console.log('about to load ');
	var script = fs.readFileSync( source( example.src ) );
	var doccoPagelet = pagelet( example.src );
	var outputFile =  html( example.src );
	console.log( doccoPagelet );

	var locals = {
		pretty: options.pretty,
		layout: true,
		title: example.title + ' - Toxiclibs.js',
		script: '\n'+script,
		name: example.title,
		src: example.src,
		options: example.options || {},
		dependencies: example.dependencies
	};

	var tmplOpts = {
		filename: layout(),
		pretty: options.pretty
	};


	fs.readFile( doccoPagelet , function( err, body ){
		locals.pagelet = body;
		//read the jade template
		fs.readFile( view(example.template), function( err, body ){
			var fn = jade.compile(body, tmplOpts );
			msg( 'Example: ', locals.title );
			var output = fn(locals);
			fs.writeFile( outputFile, output, function( err ){
				callback( err );
				//console.log('generated');
			});
		});
	});
}

function generatePage( page, callback ){
	var locals = {
		pretty: options.pretty,
		layout: true,
		title: page.title + ' - Toxiclibs.js',
		options: page.options || {},
		dependencies: page.dependencies
	};

	var tmplOpts = {
		filename: layout(),
		pretty: options.pretty
	};

	fs.readFile( view(page.template), function( err, body ){
		var fn = jade.compile(body, tmplOpts);
		msg( 'Page: ', locals.title );
		var output = fn( locals );
		fs.writeFile( html( page.out ), output, function( err ){
			if(callback) callback( err );
		});
	});
}


function compileScripts( callback ){
	var config = {
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
		modules: [{
			name: "site/index",
			include: [ "site/map" ],
			exclude: [ 'toxi', 'jquery', 'underscore', 'backbone' ]
		}]
	};

	var optimize = requirejs.optimize( config, function( buildResponse ){
		msg( buildResponse );
	});
}

exports.compileTemplates = compileTemplates;
exports.compileLess = compileLess;
exports.compileScripts = compileScripts;
