/*global __dirname, console, process*/

//#Toxiclibs.js site build
//`node build` to build a new copy of the site
//`node build --watch` to auto-rebuild each time a template or less changes

require('colors');

var jade = require('jade'),
	less = require('less'),
	wrench = require('wrench'),
	docco = require('docco'),
	async = require('async'),
	fs = require('fs');


var options = {
	pretty: true,
	compress: false,
	css: __dirname + '/www/stylesheets/',
	html: __dirname + '/www/'
};

//docco needs to think .pde files are javascript
docco.languages[".pde"] = {"name" : "javascript", "symbol" : "//"};



function time( ){
	var dt = new Date();
	return [ dt.getHours(), dt.getMinutes(), dt.getSeconds()].join(':').red;
}

function msg( args ){
	args = Array.prototype.slice.call(arguments, 0);
	args.unshift( time() );
	console.log.apply( console.log, args );
}


if (process.argv[2] === '--watch'){
	watchThenDo( 'less', compileLess );
	watchThenDo( 'views', compileTemplates );
	watchThenDo( 'examples', compileTemplates );
} else {
	compileLess('less/');
	compileTemplates();
}

function watchThenDo( watchDirectory, tasks ){
	if( ! Array.isArray( tasks ) ){
		tasks = [tasks];
	}
	var dir = [ __dirname, '/', watchDirectory, '/' ].join('');
	msg('dir: ', dir );
	fs.readdir( dir, function( err, files ){
		if( err ) throw err;
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
}
function compileLess( dir ){
	fs.readFile( dir + 'style.less', {encoding: 'utf8'}, function( err, body ){
		if( err ) throw err;
		body = String(body);
		var parser = new(less.Parser)({
			paths: ['./less'],
			filename: './less/style.less'
		});

		parser.parse( body, function( err, tree ){
			if( err ){
				msg('LESS Error: ', err );
				return;
			}
			try {
				var css = tree.toCSS({ compress: options.compress });
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

//utilities for looking up paths
function source( src ){ return __dirname + '/examples/'+src; }
function view( tmpl ){  return __dirname + '/views/'+tmpl+'.jade'; }
function html( out ){ return options.html+out.split('.')[0]+'.html'; }
function layout(){  return __dirname + '/views/layout.jade'; }
function pagelet( src ){ return __dirname + '/docs/'+src.split('.')[0]+'.html'; }

//re-render all templates and docco
function compileTemplates(){
	var config = JSON.parse( fs.readFileSync('./config.json') );

	//generate paths to the example sources
	var sources = [];
	config.examples.forEach(function( example ){
		sources.push( source( example.src ) );
	});
	//pass to docco, then jade, then clean up
	docco.document(sources, { language: "javascript", template: __dirname + "/views/docco-template.jst"}, function( err ){
		if( err ) throw err;
		async.forEach( config.examples, generateExample, function exit( err ) {
			if( err ) throw err;
			setTimeout(function(){
				wrench.rmdirRecursive( __dirname + '/docs/', function(){
					msg('docs deleted');
				});
			}, 500);
		});
	});

	//handle pages
	config.pages.forEach(function( page ){
		generatePage( page );
	});
}




function generateExample( example, callback ){

	if( example.template === undefined ){
		example.template = "index";
	}
	var script = fs.readFileSync( source( example.src ) );
	var doccoPagelet = pagelet( example.src );
	var outputFile =  html( example.src );


	var locals = {
		pretty: options.pretty,
		layout: true,
		title: example.title + ' - Toxiclibs.js',
		script: '\n'+script,
		name: example.title,
		src: example.src,
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