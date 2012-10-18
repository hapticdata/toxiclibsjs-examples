/*global __dirname, console*/
var jade = require('jade'),
	less = require('less'),
	wrench = require('wrench'),
	docco = require('docco'),
	async = require('async'),
	fs = require('fs');

var options = {
	compress: false,
	css: __dirname + '/www/stylesheets/',
	html: __dirname + '/www/'
};



//re-render less

watchThenDo( 'less', compileLess );
watchThenDo( 'views', compileTemplates );
watchThenDo( 'examples', compileTemplates );


function watchThenDo( watchDirectory, compile ){
	var dir = [ __dirname, '/', watchDirectory, '/' ].join('');
	console.log('dir: ', dir );
	fs.readdir( dir, function( err, files ){
		if( err ) throw err;
		files.forEach(function( file ){
			var filepath = dir + file;
			console.log('watching file: ', filepath );
			fs.watchFile( filepath, {persistent: true}, function(){
				console.log('file: ', file );
				compile( dir , file );
			});
		});
	});
}
function compileLess( dir, file ){
	fs.readFile( dir + 'style.less', {encoding: 'utf8'}, function( err, body ){
		if( err ) throw err;
		body = String(body);
		var parser = new(less.Parser)({
			paths: ['./less'],
			filename: './less/style.less'
		});

		parser.parse( body, function( err, tree ){
			var css = tree.toCSS({ compress: options.compress });
			fs.writeFile( options.css + 'style.css', css, function( err ){
				if( err ) throw err;
				console.log('wrote style.css');
			});
		});


		/*less.render( body, function( err, css ){
			if( err ) throw err;
			fs.writeFile( options.css + 'style.css', css, function( err ){
				if( err ) throw err;
				console.log('wrote style.css');
			});
		});*/
	});
}

//re-render all templates and docco
function compileTemplates(){
	var config = JSON.parse( fs.readFileSync('./config.json') );
	console.log('config', config );
	var sources = [];
	config.examples.forEach(function( item ){
		sources.push( __dirname+'/examples/'+item.src+'.js' );
	});
	docco.document(sources, { template: __dirname + "/views/docco-template.jst"}, function(){
		var items = config.examples.slice(0);
		async.whilst(function whilst() {
			return (items.length > 0 );
		}, function doThis( callback ) {
			var item = items.shift();
			generateTemplates( item.src, item, callback);
		}, function exit( err ) {
			wrench.rmdirRecursive( __dirname + '/docs/', function(){
				console.log('docs deleted');
			});
		});
	});
}

function generateTemplates( file, example, callback ){

	if( example.template === undefined ){
		example.template = "index";
	}
	var script = fs.readFileSync( __dirname + '/examples/'+file+'.js');
	var doccoPagelet = __dirname + '/docs/'+file+'.html';
	var layoutTemplate =  __dirname + '/views/layout.jade';
	var jadeTemplate = __dirname + '/views/'+example.template+'.jade';
	var outputFile =  options.html+file+'.html';
	var template = "pjs";


	example.options = example.options || {};
	example.options.filename = layoutTemplate;
	example.options.pretty = true;
	var locals = { pretty: true };
	locals.layout = true;
	locals.title = example.title + ' - Toxiclibs.js';
	locals.includes = example.options.includes;


	fs.readFile( doccoPagelet , function( err, body ){
		locals.pagelet = body;
		locals.script = script;
		fs.readFile( jadeTemplate, function( err, body ){
			console.log('example.options', example.options);
			var fn = jade.compile(body, example.options );
			console.log('locals ', locals);
			var output = fn(locals);
			fs.writeFile( outputFile, output, function( err ){
				if( err ) throw err;
				console.log('write');
				callback( err );
				//console.log('generated');
			});
		});
	});
}