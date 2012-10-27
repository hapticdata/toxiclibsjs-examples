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
			if( examples.$el.is(':visible') ){
				//close it
				this.$('li').removeClass('selected').removeClass('blur');
			} else {
				//open it
				this.$('li').not('.examples').removeClass('selected');
				this.$('li.home').addClass('blur');
			}
			console.log('slideToggle: ', examples.$el.slideToggle('slow') );

		},
		clickSource: function( e ){
			e.preventDefault();
			//this.$('li').not('.source').removeClass('selected');
			this.$('.source').addClass('selected');
			console.log('annotated source clicked' );
		},
		initialize: function(){
			console.log('init navWaist ', this.$el );
			var self = this;
			$(window).scroll(function(){
				var height = $('#example-container').height();
				console.log( $(window).scrollTop(), '>', height);
				if( $(window).scrollTop() > height ){
					self.$el.addClass('fixed');
				} else {
					self.$el.removeClass('fixed');
				}
			});
		},
		render: function(){
			this.$el.append( examples.render().$el.hide() );
			return this;
		}
	});

	return NavWaist;
});