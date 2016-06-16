// # Polygon Clipping
// Rendered using [p5.js](http://p5js.org), original example by [Karsten Schmidt](http://postpsectacular.com) for Processing.

// This example is a demonstration of the `toxi.geom.SutherlandHodgemenClipper` for 2D polygon clipping.
// The screen is divided into a grid of small rectangles which are used as the clipping shapes for moving polygons.
//
// **Usage:** press and hold mouse to reveal polygons without clipping.

// _Note:_ only referencing these locally to illustrate which modules are used in this example
var Polygon2D = toxi.geom.Polygon2D,
    Vec2D = toxi.geom.Vec2D,
    Rect = toxi.geom.Rect,
    Circle = toxi.geom.Circle,
    SineWave = toxi.math.waves.SineWave,
    SutherlandHodgemanClipper = toxi.geom.SutherlandHodgemanClipper;


var COLS = 8,
    ROWS = 6,
    cells = [],
    isClipped = true;



// p5.js will call a global `setup()` function once at the beginning
function setup(){
    var p5Renderer2D = createCanvas(window.innerWidth, window.innerHeight - 200);
    document.getElementById('example-container').appendChild(p5Renderer2D.canvas);

    strokeWeight(2);

    var cellSize = new Vec2D(width/COLS, height/ROWS);

    for(var y=0; y<height; y+=cellSize.y){
        for(var x=0; x<width; x+=cellSize.x){

            var cell = new ClipCell(
                new Rect(x+2, y+2, cellSize.x-4, cellSize.y-4)
            );

            cells.push(cell);

        }
    }
}

// p5.js will call a global `draw()` function repeatedly
function draw(){

    background(255, 0, 0);
    noFill();
    stroke(255);
    cells.forEach(function(c){
        c.update();
        c.draw(isClipped);
    });
}

function toggleClipping(){
    isClipped = !isClipped;
}

function mousePressed(){
    toggleClipping();
}

function mouseReleased(){
    toggleClipping();
}


// Lissajous is brief class for using a wave to control the cells movement
function Lissajous(waveX, waveY){
    this.xmod = waveX;
    this.ymod = waveY;
}

Lissajous.prototype.update = function(){
    this.x = this.xmod.update();
    this.y = this.ymod.update();
}


function ClipCell(bounds){
    this.bounds = bounds;
    var m = Math.min(bounds.width, bounds.height);
    this.dot = new Circle(bounds.getCentroid(), random(m*0.2, m*0.66));

    // create a `toxi.math.waves.SineWave` to modulate movement with Lissajous,
    // parameters are `phase`, `frequency`, `amplitude`, `offset`
    var wx = new SineWave(0, random(0.01, 0.08), bounds.width * 0.5, bounds.getCentroid().x),
        wy = new SineWave(0, random(0.01, 0.08), bounds.height * 0.5, bounds.getCentroid().y);

    this.curve = new Lissajous(wx, wy);
}

ClipCell.prototype.update = function(){
    this.curve.update();
    this.dot.set(this.curve.x, this.curve.y);
};

ClipCell.prototype.draw = function(useClipping){
    var poly = this.dot.toPolygon2D(30);
    if(useClipping){
        var clipper = new SutherlandHodgemanClipper(this.bounds);
        poly = clipper.clipPolygon(poly);
    }

    beginShape();
    poly.vertices.forEach(function(v){
        vertex(v.x, v.y);
    });
    endShape(CLOSE);
}
