/**
* Google Analytics AMD Module
* wraps ga.js and provides helpful utilities,
* variables configured via requirejs.config will have priority
*
* @example "Basic"
*  var ga = require('google-analytics');
*  ga
*      .init({ account: 'UA-XXXXX-XX' })
*      .trackPageview( '/' )
*      .trackEvent('click','about');
*
* @example "Using require.js config"
*  //in your config:
*  requirejs.config({
*      config: {
*          'google-analytics': {
*              account: 'UA-XXXXX-XX',
*              debug: true
*          }
*      }
*  });
*  //in your application:
*  ga
*      .init()
*      .trackPageview('/');
*/
define(function( require, exports, module ){
    var defaults = require('underscore').defaults;
    //wraps google analytics snippet and grabs the `_gat` and `_gaq` objects
    var _gaq,
        _gat,
        initialized = false,
        disabled = false,
        loadScript,
        options = {},
        onLoadCallback = function(){},
        checkForLoadComplete;

    //load the google analytics js script
    loadScript = function(){
        //load google analytics
        var scrpt = options.debug ? '/u/ga_debug.js' : '/ga.js';
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com'+ scrpt;
        //place it in the head before all other scripts
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        checkForLoadComplete(function(){
            var tmp = _gaq;
            _gaq = window._gaq;
            //push all of the queue items that were registered before the script loaded
            for(var i=0, l = tmp.length; i<l; i++){
                _gaq.push( tmp[i] );
            }
            onLoadCallback();
        });

        //replace thyself, thou shalt not duplicate
        loadScript = function(){};
    };
    /*
     * Initialize tracking
     * @param {Object} opts options for the module
     * @param {String} opts.acccount account id
     * @param {String | Boolean } [opts.setDomainName] true to set it to 'none'
     * @param {Function} [callback] receive a callback when analytics has been loaded
     */
    exports.init = function( opts, callback ){
        //apply requirejs config as superior to options
        opts = opts || {};
        options = defaults( module.config(), opts);
        //if only callback provided assign it correctly
        if( arguments.length === 1 && typeof arguments[0] === 'function' ){
            callback = opts;
            opts = {};
        }
        if( typeof callback === 'function' ){
            onLoadCallback = callback;
        }
        if( initialized ){
            callback();
            return exports;
        }
        initialized = true;
        _gaq = [
            ['_setAccount', options.account]
        ];

        if( options.setDomainName ){
            _gaq.push( ['_setDomainName', typeof options.setDomainName === 'string' ? options.setDomainName : 'none'] );
        }

        disabled = options.disabled;
        exports[disabled ? 'disable' : 'enable']();
        return exports;
    };

    /**
     * get the account id
     */
    exports.getAccount = function(){
        return options.account;
    };

    /**
     * is google-analytics in debug-mode?
     */
    exports.isDebugging = function(){
        return !!options.debug;
    };

    /**
     * is this module enabled?
     * @return true if enabled
     */
    exports.isEnabled = function(){
        return !disabled;
    };

    /**
     * enable the module
     * @return itself
     */
    exports.enable = function(){
        loadScript();
        disabled = false;
        return exports;
    };
    /**
     * disable the module
     * @return itself
     */
    exports.disable = function(){
        disabled = true;
        return exports;
    };

    /**
     * direct access to the google-analytics queue (window._gaq)
     * @return {Array}
     */
    exports.queue = function(){
        return _gaq;
    };

    /**
     * set the account id
     * @param {String} id
     * @return itself
     */
    exports.setAccount = function( account ){
        _gaq.push(['_setAccount', account ]);
        options.account = account;
        return exports;
    };

    /**
     * track an event
     * https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiEventTracking#_gat.GA_EventTracker_._trackEvent
     * @param {String} category
     * @param {String} [action]
     * @param {String} [opt_label]
     * @param {String} [opt_value]
     * @param {String} [opt_noninteraction]
     * @return itself
     */
    exports.trackEvent = function( category, action, opt_label, opt_value, opt_noninteraction ){
        if(disabled){
            return exports;
        }
        var arr = Array.prototype.slice.call( arguments, 0 );
        arr.unshift( '_trackEvent' );
        _gaq.push(arr);
        return exports;
    };

    /**
     * track a pageview
     * @param {String} [opt_pageURL] optionally provide the URL to track as
     * @return itself
     */
    exports.trackPageview = function( opt_pageURL ){
        if(disabled){
            return exports;
        }
        var arr = Array.prototype.slice.call( arguments, 0 );
        arr.unshift('_trackPageview');
        _gaq.push(arr);
        return exports;
    };

    /**
     * add raw data to the queue,
     * anything not in this module can still be accomplished via this function
     * @param {…args} *args arguments to be pushed into queue
     */
    exports.raw = function( args ){
        if( disabled ){
            return exports;
        }
        _gaq.push( Array.prototype.slice.call( arguments, 0 ) );
        return exports;
    };

    /**
     * @private
     * ping this function until the analytics is loaded
     */
    checkForLoadComplete = function( callback ){
        if( window._gat !== undefined ){
            _gat = window._gat;
            !callback || callback();
        } else {
            setTimeout(checkForLoadComplete, 100, callback);
        }
    };

});
