define(function( require, exports, module ){
    var $ = require('jquery'),
        prettyPrint = require('prettify');
    return function(){
        //pretty-print andy <pre>
        if( $('pre').length > 0 ){
            /*$('pre').each(function(){
                if( !$(this).closest('.docco').length ){
                    $(this).addClass('prettyprint').addClass('linenums');
                }
            });*/
            prettyPrint();
        }
    };
});
