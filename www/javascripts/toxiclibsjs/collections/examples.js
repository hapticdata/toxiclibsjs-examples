define([
	'jquery',
	'underscore',
	'backbone',
	'toxiclibsjs/models/Example'
], function( $, _, Backbone, Example ){

	var Examples =Backbone.Collection.extend({
		url: function(){ return '../config.json'; },
		model: Example,
		parse: function( res ){
			return res.examples;
		}
	});
	var collection = new Examples();
	collection.Examples = Examples;
	window.collection = collection;
	return collection;
});