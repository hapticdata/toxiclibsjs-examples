define([
	'jquery',
	'underscore',
	'backbone',
	'domReady',
	'./views/Navigation',
	'prettify'
], function ( $, _, Backbone, domReady, Navigation, prettyPrint ){
	console.log('main');
	domReady(function(){
		if( $('pre').length > 0 ){
			/*$('pre').each(function(){
				if( !$(this).closest('.docco').length ){
					$(this).addClass('prettyprint').addClass('linenums');
				}
			});*/
			prettyPrint();
		}
		var $nav = new Navigation({
			el: $("#navigation"),
			lock: !$("body").hasClass("no-lock")
		}).render();

		if( $("body").hasClass("index") ){
			$nav.toggleExamples();
		}
	});
});
    