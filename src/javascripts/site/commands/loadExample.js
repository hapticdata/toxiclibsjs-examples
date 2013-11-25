define(function( require, exports, module ){
    var config = module.config();
    //launch an example using require.js if provided
    return function(){
        require([config.example],function( example ){
            if( typeof example === 'function' ){
                example();
            }
        });
   };
});
