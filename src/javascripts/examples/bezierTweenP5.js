// # Bezier Tween
// Rendered using [p5.js](http://p5js.org), original example by [Karsten Schmidt](http://postspectacular.com) for Processing.

// This example uses the `toxi.math.BezierInterpolation` strategy to control
// the resolution of a polygon. `toxi.math.BezierInterpolation` is one of 10
// inpterpolation strategies found in `toxi.math`.
//
// **Usage:** Move your mouse horizontally to move through the bezier curve.

// _Note:_ I am only referencing these locally as a way to illustrate what I'm using in this example
var BezierInterpolation = toxi.math.BezierInterpolation
    Polygon2D = toxi.geom.Polygon2D,
    Circle = toxi.geom.Circle,
    Vec2D = toxi.geom.Vec2D;

// the max range value for the interpolation function
var MAX_RES = 24;

var bottomRemainder = 200;

// create a new BezierInterpolation with 2 coefficients, modify
// the coefficients of the curve with the gui in the top-right.
var tween = new BezierInterpolation(1, -2.2);

var gui = new dat.gui.GUI();
gui.add(tween, 'c1', -3, 3).step(0.1);
gui.add(tween, 'c2', -3, 3).step(0.1);


//in p5.js our global setup() function is called once, first
function setup(){
    var p5Renderer2D = createCanvas(window.innerWidth, window.innerHeight - bottomRemainder);
    document.getElementById('example-container').appendChild(p5Renderer2D.canvas);
}



//in p5.js our draw() function is called repeatedly
function draw(){
    background(255);

    noFill();
    stroke(0, 255, 255);

    var normX = mouseX / width;

    // 3 in the min range value, `MAX_RES` is the max range value
    // `normX` is a value between 0-1
    var res = tween.interpolate(3, MAX_RES, normX);

    var poly = new Circle(new Vec2D(width/2,height/2), 150).toPolygon2D(round(res));

    beginShape();
    poly.vertices.forEach(function(v){
        vertex(v.x, v.y);
    });
    endShape(CLOSE);


    var scale = height / MAX_RES;

    stroke(160);
    beginShape();
    for(var x=0; x<= width; x+=5){
        vertex(x, tween.interpolate(3, MAX_RES, x/width) * scale);
    }
    endShape();

    stroke(255, 0, 128);
    ellipse(mouseX, res*scale, 10, 10);
}

function windowResized(){
    resizeCanvas(window.innerWidth, window.innerHeight - bottomRemainder);
}
