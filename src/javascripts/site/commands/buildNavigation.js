define(function( require, exports, module ){
    var $ = require('jquery'),
        ExamplesConfig = require('../models/examplesConfig'),
        Navigation = require('../views/Navigation'),
        stackedDrawer = require('../ui/stacked-drawer');

    var createStackedDrawer = function( el ){
        var drawer = stackedDrawer();
        $('body').append( drawer.render().$el );
        drawer
            .watch(el)
            .on('intersected', drawer.push)
            .on('above', drawer.push)
            .on('returned', drawer.pop);
    };
    //load the sitemap and build the nav
    return function(){
        var siteMap = new ExamplesConfig(),
            shouldLock = !$("body").hasClass("no-lock");


        siteMap.fetch()
            .then(function(){
                var nav = new Navigation({
                    el: $("#navigation"),
                    lock: false,//
                    model: siteMap
                }).render();

                if( shouldLock ){
                    createStackedDrawer(nav.el);
                }

                if( $("body").hasClass("index") ){
                    nav.toggleExamples();
                }
            });
    };
});
