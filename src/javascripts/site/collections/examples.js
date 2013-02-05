define([
	'jquery',
	'underscore',
	'backbone',
	'../models/Example'
], function( $, _, Backbone, Example ){

	var Examples = Backbone.Collection.extend({
		url: function(){ return '../config.json'; },
		model: Example,
		/*add: function( object ){
			
			if( _.isArray( object ) ){
				_( object ).each(function( o, i ){
					object[i] = Example.prototype.parse.call(object, o);
				});
			} else {
				object = Example.prototype.parse.call( object, object );
			}
			return Backbone.Collection.prototype.add.call(this, object );
		},*/
		parse: function( res ){
			res.examples.forEach(function( example, i ){
				res.examples[i] = Example.prototype.parse.call( res, example );
			});
			return res.examples;
		}
	});
	var collection = new Examples();
	collection.Examples = Examples;
	window.collection = collection;
	return collection;
});