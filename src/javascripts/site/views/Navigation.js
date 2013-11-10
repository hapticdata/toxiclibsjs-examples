define([
	'jquery',
	'underscore',
	'backbone',
	'./examples'
], function( $, _, Backbone, Examples ){

	var NavWaist = Backbone.View.extend({
		events: {
			'click li': 'updateSelected',
			'click .examples': 'toggleExamples',
			'click .source': 'clickSource'
		},
		updateSelected: function( e ){

		},
		toggleExamples: function( e ){
			if( e && e.preventDefault ){
				e.preventDefault();
			}
			if( this.examplesView.$el.is(':visible') ){
				//close it
				this.$('li').removeClass('selected').removeClass('blur');
			} else {
				//open it
				this.$('li').not('.examples').removeClass('selected');
				this.$('li.home').addClass('blur');
			}
			this.examplesView.$el.slideToggle('slow');
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
            this.examplesView = new Examples({ model: this.model });
			if( this.options.lock ){
				console.log("lock Navigation to top");
				$(window).scroll(function(){
					var height = $('.above').height();
					//console.log( $(window).scrollTop(), '>', height);
					if( $(window).scrollTop() > height ){
						self.$el.addClass('fixed');
						self.$el.parent().find('.below').css({ 'padding-top': 350 });
					} else {
						self.$el.removeClass('fixed');
						self.$el.parent().find('.below').css({ 'padding-top': 0 });
					}
				});
			}
		},
		render: function(){
			this.$el.append( this.examplesView.render().$el.hide() );
			return this;
		}
	});

	return NavWaist;
});
