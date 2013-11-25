define(function( require, exports, module ){

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone');


    _.extend( exports, Backbone.Events );

    //start the application
    exports.start = function( options ){
        options = options || {};
        exports.trigger('initialize:before', options);
        $(document).ready(function(){
            exports.trigger('initialize');
            exports.trigger('initailize:after', options);
        });
    };
});
