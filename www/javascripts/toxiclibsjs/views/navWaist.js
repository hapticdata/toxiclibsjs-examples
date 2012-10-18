define([
	'jquery',
	'underscore',
	'backbone',
	'./examples'
], function( $, _, Backbone, examples ){

	var NavWaist = Backbone.View.extend({
		events: {
			'click li': 'updateSelected',
			'click .examples': 'clickExamples',
			'click .source': 'clickSource'
		},
		updateSelected: function( e ){
			
		},
		clickExamples: function( e ){
			e.preventDefault();
			this.$('li').not('.examples').removeClass('selected');
			examples.$el.slideToggle('slow');

		},
		clickSource: function( e ){
			e.preventDefault();
			//this.$('li').not('.source').removeClass('selected');
			this.$('.source').addClass('selected');
			console.log('annotated source clicked' );
		},
		initialize: function(){
			console.log('init navWaist ', this.$el );
		},
		render: function(){
			this.$el.parent().append( examples.render().$el.hide() );
			return this;
		}
	});

	return NavWaist;
});