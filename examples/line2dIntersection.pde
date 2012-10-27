//#Line2D Intersection
//ported to javascript by [Kyle Phillips](http://haptic-data.com)
//original example by [Karsten Schmidt](http://postspectacular.com)
//
//In this example we calculate the intersection point of two lines, one of which
//can be moved by user interactively.

/*
 * Copyright (c) 2010 Karsten Schmidt
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * http://creativecommons.org/licenses/LGPL/2.1/
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */


var Vec2D = toxi.geom.Vec2D,
    Line2D = toxi.geom.Line2D;
 
void setup() {
  size(940,480);
  smooth();
  textSize(9);

}
 
void draw() {
  background(240);
  Line2D l=new Line2D(new Vec2D(250,50), new Vec2D(450,350));
  Line2D m=new Line2D(new Vec2D(450,200), new Vec2D(mouseX,mouseY));
  Line2D.LineIntersection isec=l.intersectLine(m);
  if (isec.getType()== Line2D.LineIntersection.Type.INTERSECTING) {
    Vec2D pos=isec.getPos();
    stroke(255,0,192);
    fill(255,0,192);
    ellipse(pos.x,pos.y,5,5);
    textAlign(pos.x>width/2 ? RIGHT : LEFT);
    text("{x: "+pos.x.toFixed(2)+", y: "+pos.y.toFixed(2)+" }",pos.x,pos.y-10);
  } else {
    stroke(0);
  }
  line(l.a.x,l.a.y,l.b.x,l.b.y);
  line(m.a.x,m.a.y,m.b.x,m.b.y);
}