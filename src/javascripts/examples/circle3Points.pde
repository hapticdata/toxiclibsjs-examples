//#Circle from 3 Points
//- original example by [Karsten Schmidt](http://postspectacular.com)
//- ported to javascript by [Kyle Phillips](http://haptic-data.com)
//
//given any 3 points find its circle

//move toxiclibs.js objects locally for processing.js
var SineWave = toxi.math.waves.SineWave,
    Vec2D = toxi.geom.Vec2D,
    Circle = toxi.geom.Circle;

AbstractWave wave1=new SineWave(0,0.02,100,200);
AbstractWave wave2=new SineWave(0,0.023,100,200);

void setup() {
  size(940, 382);
  smooth();
  stroke(#330077);
  noFill();
  //this changes `ellipse()` dimensions to radius instead of diameter
  ellipseMode(RADIUS);
}

void draw() {
  background(#cceeff);
  Vec2D p1 = new Vec2D(200, wave1.update());
  Vec2D p2 = new Vec2D(400, wave2.update());
  Vec2D p3 = new Vec2D(mouseX, mouseY);
 Circle circle = Circle.from3Points(p1, p2, p3);
  if (circle != undefined) {
    ellipse(circle.x,circle.y,circle.getRadius(),circle.getRadius());
    ellipse(p1.x,p1.y,3,3);
    ellipse(p2.x,p2.y,3,3);
    ellipse(p3.x,p3.y,3,3);
  }
}
