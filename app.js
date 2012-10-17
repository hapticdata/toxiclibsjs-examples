/*global __dirname*/
var jade = require('jade'),
	less = require('less'),
	wrench = require('wrench'),
	docco = require('docco'),
	async = require('async'),
	fs = require('fs');

var config = require('./config.json');

var options = {
	compress: true,
	css: __dirname + '/www/stylesheets/',
	html: __dirname + '/www/'
};

var sources = [];
config.forEach(function( item ){
	sources.push( __dirname+'/src/'+item.src+'.js' );
});


//re-render less

watchThenDo( 'less', compileLess );
watchThenDo( 'views', compileTemplates );
watchThenDo( 'src', compileTemplates );


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
	docco.document(sources, { template: __dirname + "/views/docco-template.jst"}, function(){
		items = config.slice(0);
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

function generateTemplates( file, config, callback ){

	var script = fs.readFileSync( __dirname + '/src/'+file+'.js');
	var doccoPagelet = __dirname + '/docs/'+file+'.html';
	var layoutTemplate =  __dirname + '/views/layout.jade';
	var jadeTemplate = __dirname + '/views/'+config.template+'.jade';
	var outputFile =  options.html+file+'.html';
	var template = "pjs";

	var locals = { pretty: true };
	locals.layout = true;
	locals.title = "my title";


	fs.readFile( doccoPagelet , function( err, body ){
		locals.pagelet = body;
		locals.script = script;
		fs.readFile( jadeTemplate, function( err, body ){
			var fn = jade.compile(body, {filename: layoutTemplate, title: "hey" });
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