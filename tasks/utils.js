var fs = require('fs'),
	_ = require('underscore'),
	requirejs = require('requirejs'),
	siteMap;

requirejs.config({ nodeRequire: require });
siteMap = requirejs(__dirname + '/../src/site.js');

exports.read = function( cred ){
	var b = __dirname+'/../'+cred.baseUrl;
	return {
		docco: function( src ){
			return fs.readFileSync(__dirname+'/../docs/' + src.split('.')[0] + '.html');
		},
		example: function (src){
			return fs.readFileSync(b + 'javascripts/examples/' + src);
		},
		template: function (tmpl){
			return fs.readFileSync(b + 'views/' + tmpl+'.jade');
		}
	};
};

exports.write = function( cred ){
	return {
		template: function (src, body, callback){
			return fs.writeFile(cred.dest + src.split('.')[0] + '.html', body, callback);
		}
	};
};

/**
 * get the objects out of the siteMap just for the pages we are going
 * to generate on this invocation
 * @param {string} type the type of item in the map "examples" or "pages"
 * @param {Array|string} [a] title(s) of pages or examples to build
 * @returns {Array} of complete objects for each template
 */
exports.parseArguments = function (type, a){
	var items = [];
	if (!a){
		a = _.pluck(siteMap[type], 'title');
	}
	//ensure we get an array
	if (a && !Array.isArray(a)){
		a = [a];
	}

	a.forEach(function (ex){
		var item = _(siteMap[type]).findWhere({ title: ex });
		items.push(item);
	});
	return items;
};

