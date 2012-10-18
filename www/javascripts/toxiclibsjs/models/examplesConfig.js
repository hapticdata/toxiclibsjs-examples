define([
	'jquery',
	'underscore',
	'backbone',
	'../collections/examples',
	'../collections/Topics',
	'../collections/Apis'
], function ( $, _, Backbone, examples, Topics, Apis ){
	
	var ExamplesConfig = Backbone.Model.extend({
		defaults: {
			selectedTopic: '',
			selectedApi: '',
			examples: new examples.Examples(),
			topics: new Topics(),
			apis: new Apis()
		},
		url: function(){ return '../config.json'; },
		parse: function( res ){
			console.log('parse', res );
			this.get('examples').reset( res.examples );
			this.get('topics').reset( res.topics );
			this.get('apis').reset( res.apis );

			this.get('topics').each(function( topic ){
				var matches = this.get('examples').filter(function( example ){
					return example.get('tags').indexOf( topic.get('tag') ) > -1;
				});

				topic.set({ examples: matches });
			}, this);

			this.get('apis').each(function( api ){
				var matches = this.get('examples').filter( function( example ){
					return example.get('tags').indexOf( api.get('tag') ) > -1;
				});
				api.set({ examples: matches });
			}, this);
			this.trigger('change');
		},
		toJSON: function(){
			return {
				selectedTopic: this.get('selectedTopic'),
				selectedApi: this.get('selectedApi'),
				topics: this.get('topics').toJSON(),
				apis: this.get('apis').toJSON(),
				examples: this.get('examples').toJSON()
			};
		}
	});

	var model = new ExamplesConfig();
	model.ExamplesConfig = ExamplesConfig;
	return model;
});
    