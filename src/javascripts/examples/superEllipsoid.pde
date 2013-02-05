//#Super Ellipsoid Mesh Builder
//original example by [Karsten Schmidt](http://postspectacular.com),
//Toxiclibs ported to js by [Kyle Phillips](http://workofkylephillips.com)
//
//**Usage:**
//
//- **w:** toggle wireframe on/off
//- **n:** toggle normal vector display on/off
//
//SuperEllipsoidMeshBuilder demonstrates how to use the [SurfaceMeshBuilder](https://github.com/hapticdata/toxiclibsjs/blob/master/lib/toxi/geom/mesh/SurfaceMeshBuilder.js)
//class in conjunction with a SuperEllipsoid function to dynamically create a
//variety of useful geometric forms. It also demonstrates using
//[toxi.processing.ToxiclibsSupport](https://github.com/hapticdata/toxiclibsjs/blob/master/lib/toxi/processing/ToxiclibsSupport.js)
//for crossmode support between Processing and Processing.js.
//The super ellipsoid is described in detail on Paul Bourke's website.
//In this demo 2 out-of-sync sine waves are used to animate
//the ellipsoid parameters. Included is also a re-usable function for displaying
//a generic TriangleMesh instance, incl. the display of surface normals useful for
//debug purposes.

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


var TriangleMesh = toxi.geom.mesh.TriangleMesh,
    ToxiclibsSupport = toxi.processing.ToxiclibsSupport,
    SurfaceMeshBuilder = toxi.geom.mesh.SurfaceMeshBuilder,
    SuperEllipsoid = toxi.geom.mesh.SuperEllipsoid,
    SineWave = toxi.math.waves.SineWave,
    Vec3D = toxi.geom.Vec3D;


TriangleMesh mesh = new TriangleMesh();

AbstractWave modX, modY;
ToxiclibsSupport gfx;

boolean isWireFrame;
boolean showNormals;


void setup() {
  size(940,480, OPENGL);
  gfx = new ToxiclibsSupport(this);
  isWireFrame = true;
  modX = new SineWave(0, 0.01f, 2.5f, 2.5f);
  modY = new SineWave(PI, 0.017f, 2.5f, 2.5f);
}

void draw() {
  SurfaceFunction functor=new SuperEllipsoid(modX.update(), modY.update());
  SurfaceMeshBuilder b = new SurfaceMeshBuilder(functor);
  mesh = (TriangleMesh)b.createMesh(new TriangleMesh("se"+frameCount),20, 80);
  mesh.computeVertexNormals();
  background(0);

  lights();
  translate(width / 2, height / 2, 0);
  rotateX(mouseY * 0.01);
  rotateY(mouseX * 0.01);
  
  gfx.origin(300);
  
  if (isWireFrame) {
    noFill();
    stroke(255);
  } 
  else {
    fill(255);
    noStroke();
  }

    gfx.origin(300);
  if (isWireFrame) {
    noFill();
    stroke(255);
  } 
  else {
    fill(255);
    noStroke();
  }
  //scale(2);
  gfx.mesh(mesh, !isWireFrame, showNormals ? 10 : 0);

}


void keyPressed() {
  if (key == 'w') {
    isWireFrame = !isWireFrame;
  }
  if (key == 'n') {
    showNormals = !showNormals;
  }
  /*if (key == 's') {
    mesh.saveAsSTL(sketchPath("superellipsoid-"+(System.currentTimeMillis()/1000)+".stl"));
  }*/
}