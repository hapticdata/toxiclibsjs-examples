define([
	'jquery',
	'underscore',
	'backbone',
	'../models/examplesConfig',
	'../collections/examples',
	'jade!templates/_examples-filters',
	'jade!templates/_examples-list'
], function ( $, _, Backbone, exampleConfig, examples, navTemplate, listTemplate ){

	
	var Examples = Backbone.View.extend({
		tagName: 'section',
		className: 'examples-nav',
		events: {
			'change #topics': 'changeTopics',
			'change #apis': 'changeApis',
			'click .example-link': 'clickExample'
		},
		changeTopics: function( e ){
			this.trigger( 'change:topic', this.$("#topics").val() );
			this.model.set({ selectedTopic: this.$("#topics").val() });
		},
		changeApis: function(){
			this.trigger( 'change:api', this.$("#libs").val() );
			this.model.set({ selectedApi: this.$("#apis").val() });
		},
		clickExample: function( e ){
			var href = $( e.target ).find('a').attr('href');
			if( href === undefined ){
				href = $( e.target ).parent().find('a').attr('href');
			}
			//console.log('href: ', href);
			window.location.href = href;
		},
		initialize: function(){
			_.bindAll(this,'render');
			console.log( 'collection', this.collection );
			this.model.on('change', this.render);
			console.log( 'toJSON', this.model.toJSON() );
		},
		render: function(){
			this.$el.html( navTemplate(this.model.toJSON()) );
			this.$('.examples-list').html( listTemplate({ examples: this.model.get('filteredExamples').toJSON() }) );
			return this;
		}
	});

	var view = new Examples({ model: exampleConfig });
	window.exampleConfig = exampleConfig;
	/*view.on('change:topics', function( topic ){
		var matches;
		console.log('topic', topic);
		if( topic == "all" ){
			matches = collection;
		} else {
			matches = collection.filter(function( model ){
				return model.get('tags').indexOf(topic) > -1;
			});
		}
		filtered.reset( matches );
	});
	view.on('change:libs', function( lib ){

	});*/
	return view;
});
    