define(['require','underscore','backbone'],function ( require ){

	var _ = require('underscore'),
		Backbone = require('backbone');

	var Example = Backbone.Model.extend({
		initialize: function( props ){
			console.log('const');
			this.set( Example.prototype.parse(props) );
		},
		parse: function( response ){
			function strip( o ){
				var i = 0;
				while( o.indexOf(' ') > -1 ){
					o = o.replace(' ','');
					i++;
					if( i == 100 ) console.log("BROKEN", o );
				}
				return o;
			}
			if ( this.attributes === undefined ){
				this.attributes = {};
			}
			if ( !_.isArray(response.tags) ){
				
				response.tags = strip( response.tags ).split(',');
			}
			if ( response.thumbnail === undefined ){
				response.thumbnail = response.src.split('.')[0] + '.gif';
			}
			if ( response.thumbnail.indexOf('images/') < 0 ){
				response.thumbnail = "images/" + response.thumbnail;
			}
			response.href = response.src.split('.')[0]+'.html';
			console.log( response.tags );
			return response;
		}
	});
	return Example;
});
    