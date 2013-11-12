define(function( require, exports, module ){

    var Backbone = require('backbone');

    var config = module.config();
    console.log('CONFIG!', config);
    var urls = new Backbone.Model();
    urls.set( config );
    return urls;

});
