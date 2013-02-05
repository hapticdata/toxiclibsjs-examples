//#MeshDoodle
//- original example by [Karsten Schmidt](http://postspectacular.com)
//- toxiclibs.js by [Kyle Phillips](http://haptic-data.com)

//MeshDoodle shows how to use the `toxi.geom.mesh.TriangleMesh` class to dynamically
//build a 3D mesh, render it using Processing.js
//
//**Usage:**
//
//- Move mouse to draw a ribbon in 3D space.
//- Press any key to restart
//

/* 
 * Copyright (c) 2009 Karsten Schmidt
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

//localize the toxiclibs.js objects
var TriangleMesh = toxi.geom.mesh.TriangleMesh,
    Face = toxi.geom.mesh.Face,
    Vec3D = toxi.geom.Vec3D,
    Vec2D = toxi.geom.Vec2D;


import toxi.geom.*;
import toxi.geom.mesh.*;

TriangleMesh mesh=new TriangleMesh("doodle");

Vec3D prev=new Vec3D();
Vec3D p=new Vec3D();
Vec3D q=new Vec3D();

Vec2D rotation=new Vec2D();

float weight=0;

void setup() {
  size(940,600,OPENGL);
  fill(255,255,255);
  stroke(255,0,0);
}

void draw() {
  background(0);
  lights();
  translate(width/2,height/2,0);
  rotateX(rotation.x);
  rotateY(rotation.y);
  noStroke();
  beginShape(TRIANGLES);
  // iterate over all faces/triangles of the mesh
  Face[] faces = mesh.getFaces();
  int numFaces = faces.length;
  for(var i=0;i<numFaces;i++) {
  	
    var f=faces[i];
    // create vertices for each corner point
    _vertex(f.a);
    _vertex(f.b);
    _vertex(f.c);
  }
  endShape();
  // udpate rotation
  rotation.addSelf(0.014,0.0237);
}

void _vertex(Vec3D v) {
  //console.log(v.toString());
  vertex(v.x,v.y,v.z);
}

void mouseMoved() {
  // get 3D rotated mouse position
  Vec3D pos=new Vec3D(mouseX-width/2,mouseY-height/2,0);
  pos.rotateX(rotation.x);
  pos.rotateY(rotation.y);
  // use distance to previous point as target stroke weight
  weight+=(sqrt(pos.distanceTo(prev))*2-weight)*0.1;
  // define offset points for the triangle strip
  Vec3D a=pos.add(0,0,weight);
  Vec3D b=pos.add(0,0,-weight);
  // add 2 faces to the mesh
  mesh.addFace(p,b,q);
  mesh.addFace(p,a,b);
  // store current points for next iteration
  prev=pos;
  p=a;
  q=b;
}

void keyPressed() {
  mesh.clear();
}