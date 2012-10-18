$('#example-container')
  .addClass('centered')
  .append([
    '<select id="dimensions" style="position:relative;left:50px;">',
      '<option value="1">1 dimension</option>',
      '<option value="2">2 dimensions</option>',
      '<option value="3">3 dimensions</option>',
      '<option value="4" selected>4 dimensions</option>',
    '</select>'
    ].join(''));
$("#dimensions").change(function(e){
    NOISE_DIMENSIONS = Number($(this).find(":selected").val());
});

var simplexNoise = toxi.math.noise.simplexNoise;


var size = 175;
    canvas = document.getElementById('example'),
    ctx = canvas.getContext('2d');

canvas.width = canvas.height = size;
$(canvas).css({ width: size*2, height: size*2 });

var imageData = ctx.createImageData(canvas.width,canvas.height),
    setPixel = function(x, y, r, g, b, a) {
        index = (x + y * imageData.width) * 4;
        imageData.data[index+0] = r;
        imageData.data[index+1] = g;
        imageData.data[index+2] = b;
        imageData.data[index+3] = a;
    },
    NOISE_DIMENSIONS=4, // increase upto 4
    noiseOffest = 100,
    NS = 0.05, // noise scale (try from 0.005 to 0.5)
    noiseOffset = 100,
    frameCount = 1;


var draw = function() {
  
  var i = 0,
      j = 0,
      noiseVal = 0;

  for (i = 0; i < canvas.width; i++) {
    for (j = 0; j < canvas.height; j++) {
      switch(NOISE_DIMENSIONS) {
        case 2:
          noiseVal = simplexNoise.noise(i * NS + noiseOffset, j * NS + noiseOffset); 
          break;
        case 3: 
          noiseVal = simplexNoise.noise(i * NS + noiseOffset, j * NS + noiseOffset , frameCount * 0.01); 
          break;
        case 4: 
          noiseVal = simplexNoise.noise(i * NS + noiseOffset, j * NS + noiseOffset, 0 , frameCount * 0.01); 
          break;
        default:
          noiseVal = simplexNoise.noise(i * NS + noiseOffset, 0); 
          break;
      }

      var c = Math.floor(noiseVal * 127 + 128);
      
      setPixel(i, j, c, c, c, 255);
    }
  }

  ctx.putImageData(imageData,0,0);
  noiseOffset+=NS/2;

  frameCount++;

  setTimeout(draw, 1000 / 30);
};



setTimeout(draw,1000/30);