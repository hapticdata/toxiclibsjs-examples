// # Poly Smooth
// Rendered using [p5.js](http://p5js.org), original example by [Karsten Schmidt](http://postspectacular.com) for Processing.

// This example is a demonstration of `toxi.geom.Polygon2D`'s `smooth(amount, baseWeight)` function,
// applying a low pass filter to the vertex positions of polygons in order to reduce their spatial
// contrast / sharpness and slowly approaching a rounder form.

// _Note:_ referencing these variables locally to illustrate what I'm using in this example
var Polygon2D = toxi.geom.Polygon2D,
    Vec2D = toxi.geom.Vec2D,
    ColorRange = toxi.color.ColorRange;


var polygons = [];
// number of vertices for each polygon
var numVertices = 30;
// number of polygons to create without interaction, so the screen isnt empty
var numAutoPolys = 10;

// p5.js will call this function once and first
function setup(){
    var p5Renderer2D = createCanvas(window.innerWidth, window.innerHeight - 200);
    document.getElementById('example-container').appendChild(p5Renderer2D.canvas);
    noStroke();
}

// p5.js will call this function repeatedly
function draw(){
    background(25);

    // over the course of the first few seconds, add a new poly
    // without interaction, every 10 frames
    if(frameCount % 10 === 0 && polygons.length < numAutoPolys){
        createPolyAt(random(0,width), random(0,height));
    }

    polygons.forEach(function(p){

        // toxiclibs.js `toxi.color.TColor` has a function `toRGBACSS()`
        // it outputs your color in the format of `"rgba(255, 255, 255, 1)"`
        // [learn more about CSS-related additions to TColor](https://github.com/hapticdata/toxiclibsjs/blob/master/docs/sugar.md#tcolornewcss)
        fill(p.col.toRGBACSS());

        p.smooth(0.01, 0.05);
        beginShape();
        p.vertices.forEach(function(v){
            vertex(v.x, v.y);
        });
        endShape(CLOSE);
    });
}

function mousePressed(){
    createPolyAt(mouseX, mouseY);
}


// create a new `toxi.geom.Polygon2D` with its center at the provided `x`, `y`
function createPolyAt(x, y){
    //`toxi.color.ColorRange` allows you to generate colors with constraints such as hue,
    // brightness, saturation and alpha. `toxi.color.ColorRange.BRIGHT` has constraints set
    // to only receive bright colors, `getColor()` will generate a new one.
    var col = ColorRange.BRIGHT.getColor().setAlpha(random(0.5,0.8));

    // `ColoredPolygon` is defined below, its just a `toxi.geom.Polygon2D`
    // with an additional `.col` property.
    var poly = new ColoredPolygon(col);

    var radius = random(50, 200);

    for(var i=0; i<numVertices; i++){
        poly.add(
            Vec2D.fromTheta(i/numVertices*TWO_PI)
                .scaleSelf(random(0.2,1)*radius)
                .addSelf(x,y)
        );
    }

    polygons.push(poly);

}

function windowResized(){
    resizeCanvas(window.innerWidth, window.innerHeight - 200);
}


//a class for `ColoredPolygon` extending `toxi.geom.Polygon2D`, with a `col` property
function ColoredPolygon(tcolor){
    Polygon2D.call(this);
    this.col = tcolor;
}
ColoredPolygon.prototype = Object.create(Polygon2D.prototype);
