define([
	'jquery',
	'underscore',
	'backbone',
	'domReady',
	'./views/navWaist',
	'prettify'
], function ( $, _, Backbone, domReady, navWaist, prettyPrint ){
	console.log('main');
	domReady(function(){
		if( $('pre').length > 0 ){
			$('pre').addClass('prettyprint').addClass('linenums');
			prettyPrint();
		}
		new navWaist({ el: $("#navigation") }).render();
	});
});
    