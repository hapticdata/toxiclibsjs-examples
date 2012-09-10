
var docco = require('docco'),
	fs = require('fs');

var src = '../src/terrainNoise.js';
fs.readFile(src, function( err, body ){
	var sections = docco.parse( src, body.toString() );


	docco.highlight( src, sections, function(){
		console.log('args', arguments);

		console.log('sections: ', sections);
	});

});