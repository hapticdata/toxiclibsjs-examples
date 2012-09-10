/**
 *
 * @author Karsten Schmidt <info at postspectacular dot com>
 */

/* 
 * Copyright (c) 2008-2009 Karsten Schmidt
 * 
 * This demo & library is free software; you can redistribute it and/or
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


 var  VerletPhysics2D = toxi.physics2d.VerletPhysics2D,
      VerletParticle2D = toxi.physics2d.VerletParticle2D,
      Vec2D = toxi.geom.Vec2D,
      Rect = toxi.geom.Rect,
      ParticleString2D = toxi.physics2d.ParticleString2D;

import processing.opengl.*;

import toxi.physics2d.constraints.*;
import toxi.physics2d.*;

import toxi.geom.*;
import toxi.math.*;

int NUM_PARTICLES = 125;
int REST_LENGTH=10;

VerletPhysics2D physics;
VerletParticle2D head,tail;

boolean isTailLocked;

void setup() {
  size(window.innerWidth, 540);
  smooth();
  physics=new VerletPhysics2D();
  physics.setWorldBounds( new Rect(0,0,width,height) );
  Vec2D stepDir=new Vec2D(1,1).normalizeTo(REST_LENGTH);
  ParticleString2D s=new ParticleString2D(physics, new Vec2D(), stepDir, NUM_PARTICLES, 1, 0.1);
  head=s.getHead();
  head.lock();
  tail=s.getTail();
}

void draw() {
  background(0);
  stroke(255,100);
  noFill();
  head.set(mouseX,mouseY);
  physics.update();
  beginShape();
  int partLen = physics.particles.length;
  int i =0;
  for(i=0;i<partLen;i++) {
    VerletParticle2D p= physics.particles[i];
    vertex(p.x,p.y);
  }
  endShape();
  for(i=0;i<partLen;i++) {
    VerletParticle2D p= physics.particles[i];
    ellipse(p.x,p.y,5,5);
  }
}

void mousePressed() {
  isTailLocked=!isTailLocked;
  if (isTailLocked) {
    tail.lock();
  } 
  else {
    tail.unlock();
  }
}