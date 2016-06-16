//# Attraction2D
//- original example by [Karsten Schmidt](http://postspectacular.com)
//- toxiclibs.js by [Kyle Phillips](http://haptic-data.com)

//This example demonstrates how to use the behavior handling and specifically
//the attraction behavior to create forces around the current locations of
//particles in order to attract (or deflect) other particles nearby.
//
//Behaviors can be added and removed dynamically on both a
//global level (for the entire physics simulation) as well as for
//individual particles only.
//
//**Usage:** Click and drag mouse to attract particles


/*
 * Copyright (c) 2010 Karsten Schmidt
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
      AttractionBehavior = toxi.physics2d.behaviors.AttractionBehavior,
      GravityBehavior = toxi.physics2d.behaviors.GravityBehavior,
      Vec2D = toxi.geom.Vec2D,
      Rect = toxi.geom.Rect;


//**Everything below here will still work in Processing**
import toxi.geom.*;
import toxi.physics2d.*;
import toxi.physics2d.behaviors.*;

int NUM_PARTICLES = 250;

VerletPhysics2D physics;
AttractionBehavior mouseAttractor;

Vec2D mousePos;

void setup() {
  size(680, 382);
  // setup physics with 5% drag
  physics = new VerletPhysics2D();
  physics.setDrag(0.05);
  physics.setWorldBounds(new Rect(0, 0, width, height));
  // the NEW way to add gravity to the simulation, using behaviors
  physics.addBehavior(new GravityBehavior(new Vec2D(0, 0.15)));
}

void addParticle() {
 Vec2D randLoc = Vec2D.randomVector().scale(5).addSelf(width / 2, 0);
  VerletParticle2D p = new VerletParticle2D(randLoc);
  physics.addParticle(p);
  // add a negative attraction force field around the new particle
  physics.addBehavior(new AttractionBehavior(p, 20, -1.2, 0.01));
}

void draw() {
  background(255,0,0);
  noStroke();
  fill(255);
  if (physics.particles.length < NUM_PARTICLES) {
    addParticle();
  }
  physics.update();
  for (int i=0;i<physics.particles.length;i++) {
    VerletParticle2D p = physics.particles[i];
    ellipse(p.x, p.y, 5, 5);
  }


}

void mousePressed() {
  addParticle();
  mousePos = new Vec2D(mouseX, mouseY);
  // create a new positive attraction force field around the mouse position (radius=250px)
  mouseAttractor = new AttractionBehavior(mousePos, 250, 0.9);
  physics.addBehavior(mouseAttractor);
}

void mouseDragged() {
  // update mouse attraction focal point
  mousePos.set(mouseX, mouseY);
}

void mouseReleased() {
  // remove the mouse attraction when button has been released
  physics.removeBehavior(mouseAttractor);
}
