
// [Polyfill]([Erik Moller polyfill](http://paulirish.com/2011/requestanimationframe-for-smart-animating/) for requestAnimationFrame and cancelAnimationFrame
(function(){
	console.log("raf");
	var root = window;
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !root.requestAnimationFrame; ++x) {
		root.requestAnimationFrame = root[vendors[x]+'RequestAnimationFrame'];
		root.cancelAnimationFrame = root[vendors[x]+'CancelAnimationFrame'] || root[vendors[x]+'CancelRequestAnimationFrame'];
	}

	if (!root.requestAnimationFrame)
		root.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

	if (!root.cancelAnimationFrame)
		root.cancelAnimationFrame = function(id) {
			clearTimeout(id);
	};
}());
// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());
