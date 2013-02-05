//#Color Waves
//Demonstrates using `toxi.color.TColor` as well as `toxi.geom.Vec2D` and `toxi.geom.Rect`. Distance between
//the circles and mouse position determines color and size.
window.onload = function(){
	var container = document.getElementById("example-container"),
		columns = 6, rows = 4,
		bounds,
		notepad,
		pos = new toxi.geom.Vec2D(),
		circles = [];

	bounds = new toxi.geom.Rect({
		x: container.offsetLeft,
		y: container.offsetTop,
		width: window.innerWidth,
		height: 600
	});
	//notepad is the raphael instance
	notepad = Raphael( container, bounds.width, bounds.height );
	//create all of the circles in a grid and set their attributes
	(function createCircles(){
		var loc, circle, r, c;
		var cellDim = new toxi.geom.Vec2D( bounds.width, bounds.height );
		cellDim.scaleSelf( 1/(columns-1), 1/(rows-1) );
		for( r=0; r<rows; r++ ){
			for( c=0; c<columns; c++ ){
				loc = cellDim.scale( c, r );
				circle = notepad.circle( loc.x, loc.y, 1, 1 );
				circle.attr({
					fill: "#dddddd", stroke: "#dddddd",
					opacity: 0.5,
					scale: 4.0
				});
				circles.push(circle);
			}
		}
	}());
	//track the mouse position
	document.addEventListener( "mousemove", function(event){
		pos.set( event.pageX, event.pageY );
		update();
	},false);
	//track the first finger on any touch-device
	document.addEventListener( "touchmove", function(event){
		pos.set( event.touches[0].pageX, event.touches[0].pageY );
		//stop the page from scrolling if the touch was within the bounds
		if( pos.isInRectangle(bounds) ){
			event.preventDefault();
		}
		update();
	},false);

	function update(){
		var i = 0, l = circles.length;
		for( i=0; i<l; i++ ){
			var circle = circles[i];
			//get the bounding box from raphael
			var box = circle.getBBox();
			//raphael's box has `x` and `y` properties, we can use it directly with toxiclibs.js
			var distance = pos.distanceTo( box );
			var color = toxi.color.TColor.newHSV(distance/bounds.width,0.5,1.0);
			//`TColor#toRGBACSS()` will output the color as a css "rgba()" string
			circle.attr({ fill: color.toRGBACSS(), scale: distance*0.25 });
		}
	}
};