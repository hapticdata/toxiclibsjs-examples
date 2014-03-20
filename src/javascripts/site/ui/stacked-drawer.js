define(function( require, exports, module ){

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        visibility = require('./visibility'),
        isInDocumentFlow = require('./is-in-document-flow'),
        getScrollChange = require('./get-scroll-change'),
        View, Item, createDupe, $w;


    $w = $(window);

    //create an empty element that will take the flow-place
    //of the element getting added to the drawer (to stop content from shifting)
    createDupe = function( $el ){
        var $d = $('<div>').addClass('stacked-drawer-dupe');
        //$d.css({ border: '2px solid green' });
        $d.height( $el.outerHeight() );
        return $d;
    };


    View = Backbone.View.extend({
        tagName: 'nav',
        className: 'stacked-drawer',
        defaults: {
            activeClassName: 'stacked-drawer-child',
            css: {
                position: 'fixed',
                transform: 'translateZ(0)',
                webkitTransform: 'translateZ(0)',
                mozTransform: 'translateZ(0)',
                transformStyle: 'preserve-3d',
                webkitTransformStyle: 'preserve-3d',
                mozTransformStyle: 'preserve-3d',
                top: -2,
                height: 1,
                width: '100%',
                'z-index': 200
            }
        },
        initialize: function( options ){
            _.bindAll(this, 'updateSize','pop','push','shift','unshift','render');
            this.options = _.defaults( options || {}, this.defaults );
            this.childEls = [];
            this.length = this.childEls.length;
            visibility.withViewport( this.$el, this );
            $w.on('scroll', this.updateSize);
        },
        updateSize: function(){
            this.$el.height( this.calculateTotalHeight() );
        },
        get: function( index ){
            return this.childEls[index].$el.get(0);
        },
        getScrollChange: getScrollChange,
        //get the top of the nav
        top: function(){ return this.$el.offset().top; },
        //get the bottom of the nav
        bottom: function(){ return this.top() + this.$el.outerHeight(); },
        calculateTotalHeight: function(){
            return Math.max(_.chain(this.childEls)
            .map(function(child){ return child.$el.outerHeight(); })
            .reduce(function(mem, h){ return mem + h; },0)
            .value(), 1);
        },
        //watch an element for when it intersects
        watch: function( el ){
            var $watched = $(el),
                self = this,
                update;
            update = function(){
                if( getScrollChange() < 0 ){
                    return;
                }
                if( self.isIntersecting($watched) ){
                    self.trigger('intersected', el);
                }
                if( self.isAbove($watched) ){
                    self.trigger('above', el);
                }
            };
            $(window, el).on('scroll', update);
            _.defer(update);
            return this;
        },
        isAbove: function( $watched ){
            var t = $watched.offset().top;
            return !$.contains( this.el, $watched.get(0)) && (t <= this.top());
        },
        isIntersecting: function( $watched ){
            var t = $watched.offset().top;
            return !$.contains( this.el, $watched.get(0)) && (t <= this.bottom()) && (t >= this.top());
        },
        pop: function(){
            var child = this.childEls.pop();
            this.length = this.childEls.length;
            this.__remove(child);
            this.trigger('popped', child.$el.get(0));
            return child.$el.get(0);
        },
        push: function( el ){
            var child = this.__createChild(el);
            this.childEls.push(child);
            this.length = this.childEls.length;
            this.__add(child);
            this.$el.append( child.$el );
            this.trigger('pushed', el);
            return this.length;
        },
        shift: function(){
            var child = this.childEls.shift();
            this.length = this.childEls.length;
            this.__remove(child);
            this.trigger('shifted', el);
            return child.$el.get(0);
        },
        unshift: function( el ){
            var child = this.__createChild(el);
            this.childEls.unshift(child);
            this.__add(child);
            this.$el.prepend( child.$el );
            this.trigger('unshifted', el);
            return this.length;
        },
        __add: function( child ){
            var self = this;
            child.$el.after( child.$dupe );
            //cant use remove because that takes away bindings
            //child.$el.remove();
            //child.$el.get(0).parentElement.removeChild( child.$el.get(0) );
            child.$el.addClass(this.options.activeClassName);
            _.defer(function(){
                self.$el.height( self.calculateTotalHeight() );
            });
            var vis = visibility.withViewport( child.$dupe );
            $w.on('scroll', child.onScroll);
            return child;
        },
        __createChild: function( el ){
            var self = this;
            var child = { $el: $(el) };
            child.originalPosition = child.$el.offset();
            child.$dupe = createDupe(child.$el);
            var atReturnPosition = function(){
                return $w.scrollTop() + child.$el.position().top  <= child.originalPosition.top;
            };
            child.onScroll = function(){
                if( getScrollChange() < 0 && atReturnPosition() )  {// && ($w.scrollTop() - child.$el.position().top)  < child.$dupe.position().top ){
                    self.trigger('returned', child.$el.get(0));
                }
            };
            return child;
        },
        __remove: function( child ){
            child.$dupe.after(child.$el);
            child.$dupe.remove();
            child.$el.removeClass(this.options.activeClassName);
            this.$el.height( this.calculateTotalHeight() );
            $w.off('scroll', child.onScroll);
            return child;
        },

        render: function(){
            this.$el.css(this.options.css);
            return this;
        },
        //when a 2nd item has entered the drawer make the scroll start to hide the upper nav
        //TODO: this offset logic starts to fall apart when the 3rd item is encountered
        scrollAway: function( $el, callback ){
            var self = this;
            var startScrollTop = $w.scrollTop();
            callback = callback || function(){};
            var h = this.calculateTotalHeight() - _.last(this.childEls).$el.height();
            var onScroll = function(){
                var prog = startScrollTop - $w.scrollTop();
                var css = {
                    top: Math.min(0,Math.max(-h,prog)),
                };
                if( getScrollChange() && -prog > h ){
                    callback($el);
                    callback = function(){};
                } else if( getScrollChange() < 0 && prog >= 0 ){
                    console.log('remove scroll');
                    $w.off('scroll',onScroll);
                }
                self.$el.css(css);
            };
            $w.on('scroll', onScroll);
        }
    });


    Item = Backbone.View.extend({

    });


    exports = module.exports = function( opts ){
        return new View( opts );
    };

    exports.View = View;

});
