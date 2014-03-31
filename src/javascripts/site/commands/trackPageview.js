define(function( require, exports, module ){

    var ga = require('google-analytics'),
        env = require('../models/env'),
        isProduction = env.get('env') === 'production';

    //if the site is in dev-mode log it to a different tracking id
    ga.init({ account: isProduction ? 'UA-4451805-2' : 'UA-49543660-1' });

    return ga.trackPageview;

});
