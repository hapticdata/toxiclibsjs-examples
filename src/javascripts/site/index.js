define(function( require ){

    var app = require('./application'),
        consolePolyfill = require('./commands/console'),
        rAFPolyfill = require('./commands/requestAnimationFrame'),
        trackPageview = require('./commands/trackPageview'),
        loadExample = require('./commands/loadExample'),
        prettyPrint = require('./commands/prettyPrint'),
        buildNavigation = require('./commands/buildNavigation');

    app
        .on('initialize:before', consolePolyfill)
        .on('initialize:before', rAFPolyfill)
        //remove next line if you want to disable Google Analytics
        .on('initialize:before', trackPageview)
        .on('initialize', loadExample)
        .on('initialize', prettyPrint)
        .on('initialize', buildNavigation)
        .start();
});

