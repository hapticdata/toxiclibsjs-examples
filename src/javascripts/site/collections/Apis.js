define([
	'jquery',
	'underscore',
	'backbone',
	'../models/Api'
], function ( $, _, Backbone, Api ){
	return Backbone.Collection.extend({ model: Api });
});
    