// # Force Directed Graph
// Rendered using [p5.js](http://p5js.org), original example by [Karsten Schmidt](http://postspectacular.com) for Processing.
// Based on [The Nature of Code](http://natureofcode.com)
//
// **Usage:** Use the GUI in the upper-right to modify settings then click _New Graph_

// _Note:_ referencing these locally to illustrate what features of toxiclibs.js are being used
var VerletPhysics2D = toxi.physics2d.VerletPhysics2D,
    VerletParticle2D = toxi.physics2d.VerletParticle2D,
    VerletSpring2D = toxi.physics2d.VerletSpring2D,
    VerletMinDistanceSpring2D = toxi.physics2d.VerletMinDistanceSpring2D,
    Vec2D = toxi.geom.Vec2D,
    Rect = toxi.geom.Rect;

function times(n, fn){
    var arr = [];
    for(var i=0; i<n; i++){
        arr.push(fn(i,n));
    }
    return arr;
};

// utility to provide an iterator function with everly element
// and every element after that element
function forEachNested(arr, fn){
    for(var i=0; i<arr.length; i++){
        for(var j=i+1; j<arr.length; j++){
            var result = fn(arr[i], arr[j], i, j, arr);
            if(result === false){
                return;
            }
        }
    }
}

var options = {
    numClusters: 8,
    particleRadius: 16,
    showPhysics: true,
    showParticles: true,
    springStrength: 0.01,
    minDistanceSpringStrength: 0.05
};

var gui = new dat.gui.GUI();
gui.add(options, 'numClusters', 5, 16).step(1);
gui.add(options, 'showPhysics');
gui.add(options, 'showParticles');
gui.add(options, 'springStrength', 0, 0.1).step(0.001);
gui.add(options, 'minDistanceSpringStrength', 0, 0.1).step(0.001);
gui.add({ makeGraph: makeGraph }, 'makeGraph').name('New Graph');


var clusters,
    physics;

var bottomPadding = 200;

function setup(){
    var p5Renderer2D = createCanvas(window.innerWidth, window.innerHeight - bottomPadding);
    document.getElementById('example-container').appendChild(p5Renderer2D.canvas);

    physics = new VerletPhysics2D();
    physics.setWorldBounds(new Rect(10, 10, width-20, height-20));

    // Spanw a new random Graph
    makeGraph();
}

function makeGraph(){
    physics.clear();

    clusters = times(options.numClusters, function(){
        return new Cluster(
            Math.floor(random(3,8)),
            Math.floor(random(20, 100)),
            new Vec2D(width/2, height/2)
        );
    });

    forEachNested(clusters, function(ci, cj){
        ci.connect(cj);
    })
}

function draw(){

    // update the physics world
    physics.update();

    background(255);

    // display all points
    if(options.showParticles){
        clusters.forEach(function(c){
            c.display();
        });
    }

    // show the physics
    if(options.showPhysics){
        forEachNested(clusters, function(ci, cj){
            //cluster internal connections
            ci.showConnections();
            // cluster connections to other clusters
            ci.showConnections(cj);
        });
    }
}

// A Cluster class, based on [The Nature of Code](http://natureofcode.com/)
// Initialize a Cluster with a number of nodes, a diameter and a centerpoint
function Cluster(n, d, center){
    this.diameter = d;
    this.nodes = times(n, function(){
        return new Node(center.add(Vec2D.randomVector()));
    });

    for(var i=1; i<this.nodes.length; i++){
        var pi = this.nodes[i];
        for(var j=0; j<i; j++){
            var pj = this.nodes[j];
            physics.addSpring(new VerletSpring2D(pi, pj, d, options.springStrength));
        }
    }
}

Cluster.prototype.display = function(){
    this.nodes.forEach(function(n){
        n.display();
    });
};

// This function connects one cluster to another
// Each point of one cluster connects to each point of the other cluster
// A `toxi.physics2d.VerletMinDistanceSpring2D` is a string which only enforces its `restLength`
// if the current distance is less than its `restLength`. This is handy if you just want
// to ensure objects are at elast a certain distance from each other, but don't
// care if its bigger than the enforced minimum.
Cluster.prototype.connect = function(other){
    var selfDiam = this.diameter;
    this.nodes.forEach(function(pi){
        other.nodes.forEach(function(pj){
            physics.addSpring(
                new VerletMinDistanceSpring2D(
                    pi,
                    pj,
                    (selfDiam + other.diameter) * 0.5,
                    options.minDistanceSpringStrength
                )
            );
        })
    });
};

Cluster.prototype.showConnections = function(other){
    if(!other){
        //draw all the internal connections
        stroke(0, 150);
        forEachNested(this.nodes, function(pi, pj){
            line(pi.x, pi.y, pj.x, pj.y);
        });
    } else {
        stroke(0, 15);
        this.nodes.forEach(function(pi){
            other.nodes.forEach(function(pj){
                line(pi.x, pi.y, pj.x, pj.y);
            });
        });
    }
};



// Node inherits from `toxi.physic2d.VerletParticle2D`
// and adds a `display()` function for rendering with p5.js
function Node(pos){
    // extend VerletParticle2D!
    VerletParticle2D.call(this, pos);
}

Node.prototype = Object.create(VerletParticle2D.prototype);

Node.prototype.display = function(){
    fill(0, 150);
    stroke(0);
    ellipse(this.x, this.y, options.particleRadius, options.particleRadius);
};
