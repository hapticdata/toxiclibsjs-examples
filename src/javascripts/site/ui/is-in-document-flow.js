/**
 * This module returns a predicate function where true means
 * the element is within the normal document flow of a page (not fixed etc)
 */
define(function( require, exports, module ){
    var $ = require('jquery'),
        ok, isFloating, passOverflow, passPosition, passDisplay;

    //is the object floating?
    isFloating = function( $elm ){
        return $elm.css('float') !== 'none';
    };

    passOverflow = function( $elm ){
        return $elm.css('overflow') === 'visible';
    };

    passPosition = function( $elm ){
        var p = $elm.css('position');
        return p === 'static' || p === 'relative';
    };

    passDisplay = function( $elm ){
        var d = $elm.css('display');
        return d === 'block' || d === 'list-item' || d === 'table' || d === 'template';
    };

    ok = function($elm, includeOverflow) {
        includeOverflow = !!(includeOverflow);
        return !isFloating($elm) && (!includeOverflow || passOverflow($elm)) && passPosition($elm) && passDisplay( $elm );
    };

    /**
     * Check if an element is within the normal document flow
     * @param {Element} elm
     * @param {boolean} [includeOverflow] is the requirement of overflow:visible important? defaults: false
     * @param {Element} [ctxRoot] context-root defaults to document.body
     * @return true if in document flow
     */
    return function(elm, includeOverflow, ctxRoot) {
        ctxRoot = ctxRoot || document.body;
        var $elm = $(elm),
            ch = -1,
            h;

        if (!$elm.length) {
            return false;
        }

        while ($elm[0] !== document.body) {
            h = $elm.height();
            if (h < ch || !ok($elm, includeOverflow)) {
                return false;
            }
            ch = h;
            $elm = $elm.parent();
            if (!$elm.length) {
                // not attached to the DOM
                return false;
            }
            if ($elm[0] === ctxRoot) {
                // encountered the ctxRoot and has been
                // inflow the whole time
                return true;
            }
        }
        // should only get here if elm
        // is not a child of ctxRoot
        return false;
    };
});
