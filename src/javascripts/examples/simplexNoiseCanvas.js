//#Simplex Noise
//**Usage:** use the select box to change dimensions
//Demonstrates the use of `toxi.math.noise.SimplexNoise`

var simplexNoise = toxi.math.noise.simplexNoise.noise,
	opts,
	size = 150,
	canvasScale = 3.0,
	canvas = document.getElementById('example'),
	ctx = canvas.getContext('2d'),
	noiseOffset = 100,
	frameCount = 1,
	imageData;

//the canvas pixels are `size` x `size`, but its
//css pixels are multipled by `canvasScale` to appear larger on screen
canvas.width = canvas.height = size;
$(canvas)
	.css({ width: size*canvasScale, height: size*canvasScale })
	.parent().addClass('centered');
	
imageData = ctx.createImageData( canvas.width, canvas.height );

opts = {
	running: true,
	size: 150,
	speed: 0.01,
	canvasScale: 2.5,
	dimensions: 4,
	xyScalar: 0.05,
	zScalar: 0.01,
	wScalar: 0.02,
	noiseOffset: 100
};

function setPixel(x, y, r, g, b, a) {
	var index = (x + y * imageData.width) * 4;
	imageData.data[index+0] = r;
	imageData.data[index+1] = g;
	imageData.data[index+2] = b;
	imageData.data[index+3] = a;
}

(function initGui(){
	var gui = new dat.GUI();
	gui.add(opts, 'running').onChange(function(){
		if( opts.running ) draw();
	});
	gui.add(opts, 'dimensions', 1,4).step(1);
	gui.add(opts, 'xyScalar', 0.005, 0.25).name('1 & 2nd dim scalar');
	gui.add(opts, 'zScalar', 0.001, 0.25).name('3rd dim Scalar');
	gui.add(opts, 'wScalar', 0.001, 0.25).name('offset speed');
}());


var applyNoise = {
	"1": function( x,y ){
		return simplexNoise( x*opts.xyScalar+noiseOffset, 0 );
	},
	"2": function( x,y ){
		return simplexNoise( x*opts.xyScalar+noiseOffset, y*opts.xyScalar+noiseOffset );
	},
	"3": function( x,y ){
		return simplexNoise( x*opts.xyScalar+noiseOffset, y*opts.xyScalar+noiseOffset, frameCount*opts.zScalar );
	},
	"4": function( x,y ){
		return simplexNoise( x*opts.xyScalar+noiseOffset, y*opts.xyScalar+noiseOffset, 0, frameCount*opts.zScalar );
	}
};
function draw() {
	var x = 0,
		y = 0,
		c = 0,
		noiseVal = 0;
	//get the correct function for the # dimensions selected
	//then for every pixel on the canvas get the noise value and apply it
	var noiseFn = applyNoise[ opts.dimensions ];
	for (x = 0; x < canvas.width; x++) {
		for (y = 0; y < canvas.height; y++) {
			noiseVal = noiseFn( x,y );
			c = Math.floor( noiseVal*127 +128 );
			setPixel( x,y,c,c,c,255 );
		}
	}
	ctx.putImageData(imageData,0,0);
	noiseOffset += opts.wScalar;
	frameCount++;
	//using `requestAnimationFrame` with a [polyfill](http://paulirish.com/2011/requestanimationframe-for-smart-animating/)
	if( opts.running ){
		requestAnimationFrame( draw );
	}
}

window.onload = draw;