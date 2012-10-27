define([
	'jquery',
	'underscore',
	'backbone',
	'../models/examplesConfig',
	'../collections/examples',
	'text!../../../templates/examples-selection.html',
	'text!../../../templates/examples-list.html'
], function ( $, _, Backbone, exampleConfig, examples, navTemplate, template ){

	
	var Examples = Backbone.View.extend({
		tagName: 'section',
		className: 'examples-nav',
		template: _.template( template ),
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
			var topicExamples = new examples.Examples().reset(this.model.get('examples').clone().models);
			var apiExamples = new examples.Examples().reset(this.model.get('examples').clone().models);
			
			if( this.model.get('selectedTopic') !== "" ){
				topicExamples.reset( this.model.get('topics').where({ tag: this.model.get('selectedTopic') })[0].get('examples').slice(0) );
			}
			if( this.model.get('selectedApi') !== "" ){
				apiExamples.reset( this.model.get('apis').where({ tag: this.model.get('selectedApi') })[0].get('examples').slice(0) );
			}
			//get the examples that are in both
			var matchingExamples = apiExamples.filter(function( example ){
				return topicExamples.indexOf( example ) > -1;
			});

			var examplesCollection = new examples.Examples();
			examplesCollection.add( matchingExamples );
			console.log('examplesCollection: ', examplesCollection);

			this.$el.html( _.template(navTemplate)({ data: this.model.toJSON() }) );
			this.$('.examples-list').html( this.template({ data: { examples: examplesCollection.toJSON() } }) );
			return this;
		}
	});

	var view = new Examples({ model: exampleConfig });
	exampleConfig.fetch();
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
    