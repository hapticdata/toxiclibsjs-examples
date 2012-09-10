var jade = require('jade'),
	fs = require('fs');

var config = require('../config.json');


for(var example in config ){
	generate( example, config[example] );
}

function generate( file, config ){

	var script = fs.readFileSync( __dirname + '/../src/'+file+'.js');
	var doccoPagelet = __dirname + '/../docs/'+file+'.html';
	var layoutTemplate =  __dirname + '/../views/layout.jade';
	var jadeTemplate = __dirname + '/../views/'+config.template+'.jade';
	var outputFile =  __dirname + '/../public/docs/'+file+'.html';
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
				console.log('generated');
			});
		});
	});
}