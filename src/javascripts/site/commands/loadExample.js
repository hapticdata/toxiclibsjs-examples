define(function( require, exports, module ){
    var config = module.config();
    //launch an example using require.js if provided
    return function(){
        if( !config.example ){
            return;
        }
        //by loading all of toxiclibjs once,
        //I can be sure that it will only load the one module
        require(["toxi"], function( toxi ){
            window.toxi = toxi;
            require([config.example],function( example ){
                if( typeof example === 'function' ){
                    example();
                }
            });
        });
   };
});
