define(function( require ){

    var app = require('./application'),
        consolePolyfill = require('./commands/console'),
        rAFPolyfill = require('./commands/requestAnimationFrame'),
        loadExample = require('./commands/loadExample'),
        prettyPrint = require('./commands/prettyPrint'),
        buildNavigation = require('./commands/buildNavigation');

    app
        .on('initialize:before', consolePolyfill)
        .on('initialize:before', rAFPolyfill)
        .on('initialize', loadExample)
        .on('initialize', prettyPrint)
        .on('initialize', buildNavigation)
        .start();
});

