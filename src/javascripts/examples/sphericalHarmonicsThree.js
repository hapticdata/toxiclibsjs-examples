//#Spherical Harmonics Mesh Builder
//Demonstrates how to use the `toxi.geom.mesh.SurfaceMeshBuilder` class
//in conjunction with a spherical harmonics function to dynamically create a variety
//of organic looking forms. The function is described in detail on
//[Paul Bourke's website](http://paulbourke.net/geometry/sphericalh/).

//I like this one [4, 2, 4, 6, 4, 0, 1, 1]
var container = document.getElementById('example-container'),
    $m = $("<div>"),
    stage = new toxi.geom.Vec2D(window.innerWidth,window.innerHeight - 60),
    camera = new THREE.PerspectiveCamera( 45, stage.x / stage.y, 1, 2000),
    scene = new THREE.Scene(),
    renderer = new THREE.WebGLRenderer({ antialias: true }),
    options,
    material,
    threeMesh; //<--we'll put the converted mesh here

//set the scene
container.style.backgroundColor = "black";
camera.position.z = 800;
scene.add( camera );
renderer.setSize(stage.x,stage.y);
container.appendChild(renderer.domElement);
//add the rotation controls
var controls = new THREE.TrackballControls( camera, renderer.domElement );
controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.2;
controls.noZoom = false;
controls.noPan = false;
controls.staticMoving = false;
controls.dynamicDampingFactor = 0.1;

material = new THREE.MeshNormalMaterial({color: 0xBAE8E6, opacity: 1.0});
material.side = THREE.DoubleSide;


options = {
    objectRadius: 81,
    meshResolution: 100,
    changeHarmonics: true,
    m: [5,8,3,1,7,3,3,7],
    randomizeHarmonics: function(){
        options.m = [];
        for(var i=0; i<8; i++) {
            options.m.push( parseInt(Math.random()*9, 10) );
        }
        $m.remove();
        $m = $("<div id=\"m\">m: ["+options.m+"]"+"</div>");
        $("#guiAbout").append($m);
    },
    updateMesh: function(res){
        var sh, builder, toxiMesh, threeGeometry;
        if(res === undefined){
            res = options.meshResolution;
        }
        if(threeMesh !== undefined) {
            scene.remove(threeMesh);
        }
        if(options.changeHarmonics) {
            options.randomizeHarmonics();
        }
        //get the model
        sh = new toxi.geom.mesh.SphericalHarmonics( options.m );
        //build the surface
        builder = new toxi.geom.mesh.SurfaceMeshBuilder( sh );
        //make it into a toxiclibs TriangleMesh
        toxiMesh = builder.createMesh(new toxi.geom.mesh.TriangleMesh(),res,1,true);
        //turn the mesh into THREE.Geometry
        threeGeometry = toxi.THREE.ToxiclibsSupport.createMeshGeometry( toxiMesh );
        threeMesh = new THREE.Mesh( threeGeometry, material );
        threeMesh.scale.set(options.objectRadius,options.objectRadius,options.objectRadius);
        scene.add(threeMesh);
    }
};


//GUI
var gui = new dat.GUI();
$("#guidat")
    .find(".guidat")
    .prepend("<div id=\"guiAbout\">"+$("#about").html()+"</div>");

gui.add(options,"objectRadius")
    .name("Mesh Scale").min(10).max(500)
    .onChange(function(){
        threeMesh.scale.set(options.objectRadius,options.objectRadius,options.objectRadius);
    });
gui.add(material,"wireframe");
gui.add(options,"meshResolution")
    .name("Mesh Resolution").min(10).max(250).step(1);
gui.add(options,"changeHarmonics")
    .name("New Random Parameters");
gui.add(options,"updateMesh")
    .name("Generate New Mesh!");

/*
(function addParticles(){
    var positions = [];
    for(var k=0;k<500;k++){
        positions.push(toxi.geom.Vec3D.randomVector().scale(200+Math.random()*300));
    }
    var particleMaterial = new THREE.ParticleBasicMaterial({
        color: 0xffff00,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    //if you construct a new toxi.THREE.ToxiclibsSupport
    //and pass it the THREE.Scene it can add things for you
    //new toxi.THREE.ToxiclibsSupport( scene ).addParticles(positions, particleMaterial );
}());
*/

//create first mesh
options.updateMesh();
//start the animation loop
animate();
function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    controls.update();
    renderer.render( scene, camera );
}
