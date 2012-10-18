define(['backbone'], function ( Backbone ){
	var Example = Backbone.Model.extend({
		initialize: function(){
			console.log('const');
		},
		parse: function( response ){
			if( this.attributes === undefined ) this.attributes = {};
			response.tags = response.tags.replace('  ','').replace(' ','').split(',');
			console.log( response.tags );
			return response;
		}
	});
	return Example;
});
    