define([
	'jquery',
	'underscore',
	'backbone',
	'domReady',
	'./views/navWaist'
], function ( $, _, Backbone, domReady, navWaist ){
	console.log('main');
	domReady(function(){
		new navWaist({ el: $("#navigation") }).render();
	});
});
    