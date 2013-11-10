define([
    'module',
	'jquery',
    './models/examplesConfig',
	'./views/Navigation',
	'prettify'
], function ( module, $, ExamplesConfig, Navigation, prettyPrint ){
    //launch an example using require.js if provided
    (function(config){
        require([config.example],function( example ){
            if( typeof example === 'function' ){
                example();
            }
        });
    })(module.config());

    //pretty-print andy <pre>
    if( $('pre').length > 0 ){
        /*$('pre').each(function(){
            if( !$(this).closest('.docco').length ){
                $(this).addClass('prettyprint').addClass('linenums');
            }
        });*/
        prettyPrint();
    }
    //load the sitemap and build the nav
    var siteMap = new ExamplesConfig();
    siteMap.fetch()
        .then(function(){
            var $nav = new Navigation({
                el: $("#navigation"),
                lock: !$("body").hasClass("no-lock"),
                model: siteMap
            }).render();

            if( $("body").hasClass("index") ){
                $nav.toggleExamples();
            }
        });
});

