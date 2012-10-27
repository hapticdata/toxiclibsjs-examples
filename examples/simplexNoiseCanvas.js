//#Simplex Noise
//**Usage:** use the select box to change dimensions
//Demonstrates the use of [toxi.math.noise.SimplexNoise](https://github.com/hapticdata/toxiclibsjs/blob/master/lib/toxi/math/noise/simplexNoise.js)

/*global $, toxi*/
var simplexNoise = toxi.math.noise.simplexNoise,
	opts,
	size = 150,
	canvasScale = 2.5,
	canvas = document.getElementById('example'),
	ctx = canvas.getContext('2d'),
	noiseOffset = 100,
	frameCount = 1,
	imageData;

canvas.width = canvas.height = size;
$(canvas)
	.css({ width: size*canvasScale, height: size*canvasScale })
	.parent().addClass('centered');
	
imageData = ctx.createImageData( canvas.width, canvas.height );

opts = {
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
	gui.add(opts, 'dimensions', 1,4).step(1);
	gui.add(opts, 'xyScalar', 0.005, 0.25).name('1 & 2nd dim scalar');
	gui.add(opts, 'zScalar', 0.001, 0.25).name('3rd dim Scalar');
	gui.add(opts, 'wScalar', 0.001, 0.25).name('offset speed');
}());

function draw() {
	var i = 0,
		j = 0,
		c = 0,
		noiseVal = 0;
	for (i = 0; i < canvas.width; i++) {
		for (j = 0; j < canvas.height; j++) {
			switch(opts.dimensions) {
				case 2:
					noiseVal = simplexNoise.noise( i*opts.xyScalar+noiseOffset, j*opts.xyScalar+noiseOffset );
					break;
				case 3:
					noiseVal = simplexNoise.noise( i*opts.xyScalar+noiseOffset, j*opts.xyScalar+noiseOffset, frameCount*opts.zScalar );
					break;
				case 4:
					noiseVal = simplexNoise.noise( i*opts.xyScalar+noiseOffset, j*opts.xyScalar+noiseOffset, 0, frameCount*opts.zScalar );
					break;
				default:
					noiseVal = simplexNoise.noise( i*opts.xyScalar+noiseOffset, 0 );
			}
			c = Math.floor( noiseVal*127 + 128);
			setPixel(i, j, c, c, c, 255);
		}
	}
	ctx.putImageData(imageData,0,0);
	noiseOffset += opts.wScalar;
	frameCount++;
	//start the animation loop 60 fps
	setTimeout(draw, 1000 / 60);
}

draw();