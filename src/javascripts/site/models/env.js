define(function( require, exports, module ){

    var Backbone = require('backbone'),
        config = module.config(),
        env = new Backbone.Model();

    console.log('CONFIG!', config);
    env.set( config );
    return env;

});
