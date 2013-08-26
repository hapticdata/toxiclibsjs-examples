define([
    'module',
	'jquery',
	'underscore',
	'backbone',
	'domReady',
	'./views/Navigation',
	'prettify'
], function ( module, $, _, Backbone, domReady, Navigation, prettyPrint ){
    var config = module.config();
    console.log( 'config: ', config );
    require([config.example],function( example ){
        if( typeof example === 'function' ){
            example();
        }
    });
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

