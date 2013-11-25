/** @author kphillips */
define(function(require, exports){
	var $ = require('jquery'),
		_ = require('underscore'),
		Backbone = require('backbone');

    /**
     * bind all of the below visibility utilties to a custom viewport,
     * viewport can trigger "scroll" and "resize" events for view as well
     * @param {Object} $window
     * @param {Function} $window.scrollTop() the scrollTop value
     * @param {Function} $window.height() should return the height of the viewport
     * @return {Object} collection of functions for testing visibility within the viewport
     */
    exports.withViewport = function( $window, exports ){
        exports = exports || {};
        /**
        * is the element above the bottom-fold of the page?
        * @param $el
        * @returns {boolean} true if above the bottom of the viewport
        * @expose
        */
        var isAboveBottom = function($el, threshold){
            return $el.offset().top < $window.scrollTop() + $window.height();
        };
        /**
        * is above the top of the viewport (not visible)
        * @param $el
        * @returns {boolean} true if above viewport
        * @expose
        */
        var isAboveTop = function($el){
            return $el.offset().top + $el.height() < $window.scrollTop();
        };
        /**
        * is the element below the bottom of the viewport? (yet to be scrolled to)
        * @param $el
        * @returns {boolean} true if below the viewport
        */
        var isBelowBottom = function($el){
            return $el.offset().top >= $window.scrollTop() + $window.height();
        };
        /**
        * is the element below the top of the viewport?
        * @param $el
        * @returns {boolean} true if below the top of the viewport
        * @expose
        */
        var isBelowTop = function($el){
            return $el.offset().top + $el.height() >= $window.scrollTop();
        };

        /**
         * is the element to the right of the viewport?
         * @param $el
         * @returns {boolean} true if the element is to the right of the viewport
         * @expose
         */
        var isRight = function($el){
            return $el.offset().left > $window.width();
        };

        /**
         * is the element to the left of the viewport?
         * @param $el
         * @returns {boolean} true if the element is to the left of the viewport
         * @expose
         */
        var isLeft = function($el){
            return $el.offset().left + $el.width() < 0;
        };


        /**
        * is the element currently visible within the viewport?
        * @param $el
        * @returns {boolean} true if currently visible
        * @expose
        */
        var isVisible = function($el){
            var ot = $el.offset().top;
            var st = $window.scrollTop();
            if(!$el.parent().length){
                //isn't in the dom
                return false;
            }
            if(!isAboveBottom($el) || !isBelowTop($el) || isLeft($el) || isRight($el)){
                return false;
            }
            return  true;
        };


        //export the above functions
        exports.isAboveBottom = isAboveBottom;
        exports.isAboveTop = isAboveTop;
        exports.isBelowBottom = isBelowBottom;
        exports.isBelowTop = isBelowTop;
        exports.isLeft = isLeft;
        exports.isRight = isRight;
        exports.isVisible = isVisible;

        /**
        * return all methods back bound to the provided element
        * @param $el
        * @returns {Object} containing functions bound to element
        */
        exports.chain = function($el){
            var mthds = ['isAboveBottom', 'isAboveTop', 'isBelowBottom','isBelowTop', 'isLeft', 'isRight', 'isVisible'];
            var invocations = _.map(mthds, function(fnName){
                return function(){
                    return exports[fnName]($el);
                };
            });

            return _.extend(_.object(mthds, invocations), { $el: $el });
        };

        /**
        * BONUS!
        * Create a view that tracks its own visibility and triggers events `visible` and `invisible`
        * @event 'visible' ( this, { visibility:Boolean } )
        * @event 'invisible' ( this, { visibility:Boolean } )
        * @event 'change' ( this, { visibility:Boolean } )
        * @type {Function}
        * @constructor
        */
        var View = Backbone.View.extend({
            defaults: {
                bindAllEvents: true
            },
            bindAllEvents: function(){
                this.bindScroll();
                this.bindResize();
            },
            bindScroll: function(){
                $window.on('scroll', this.checkVisibility);
            },
            bindResize: function(){
                $window.on('resize', this.checkVisibility);
            },
            /**
            * trigger events based on updated visibility
            * @event 'visible'
            * @event 'invisible'
            * @event 'change'
            */
            checkVisibility: function(){
                var isVisible = this.isVisible(),
                    state;
                if(isVisible !== this.visible){
                    this.visible = isVisible;
                    state = { visibility: this.visible };
                    this.trigger(isVisible ? 'visible' : 'invisible', this);
                    this.trigger('change', this, { visibility: this.visible });
                }
            },
            initialize: function(opts){
                this.options = _.defaults(opts||{}, this.defaults);
                //take all of the functions associated with this modules `exports.bind` function
                //and append it to this instance
                _.extend(this, exports.chain(this.$el));
                _.bindAll(this, 'checkVisibility');
                if( this.options.bindAllEvents ){
                    this.bindAllEvents();
                }
            },
            remove: function(){
                this.unbindScroll();
                this.undelegateEvents();
                return Backbone.View.prototype.remove.call(this);
            },
            unbindAllEvents: function(){
                this.unbindScroll();
                this.unbindResize();
            },
            /**
            * remove the scroll binding from updating visibility
            */
            unbindScroll: function(){
                $window.off('scroll', this.checkVisibility);
            },
            unbindResize: function(){
                $window.off('resize', this.checkVisibility);
            }
        });

        exports.View = View;
        return exports;
    };

    //populate the module with all of the functions bound to the window
    exports.withViewport( $(window), exports );

});
