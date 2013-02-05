define([
	'jquery',
	'underscore',
	'backbone',
	'../models/Topic'
], function ( $, _, Backbone, Topic ){
	
	var Topics = Backbone.Collection.extend({
		model: Topic
	});
	return Topics;
});
    