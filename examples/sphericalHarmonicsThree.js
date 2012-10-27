/*global $, toxi, THREE, requestAnimationFrame*/
//I like this one [4, 2, 4, 6, 4, 0, 1, 1]
var container = document.getElementById('example-container'),
	$m = $("<div>"),
	stage = new toxi.geom.Vec2D(window.innerWidth,window.innerHeight - 60),
	camera = new THREE.PerspectiveCamera( 45, stage.x / stage.y, 1, 2000),
	scene = new THREE.Scene(),
	renderer = new THREE.WebGLRenderer({antialiased: true}),
	opts,
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


opts = {
	objectRadius: 81,
	meshResolution: 100,
	changeHarmonics: true,
	m: [5,8,3,1,7,3,3,7],
	randomizeHarmonics: function(){
		opts.m = [];
		for(var i=0; i<8; i++) {
			opts.m.push( parseInt(Math.random()*9, 10) );
		}
		$m.remove();
		$m = $("<div id=\"m\">m: ["+opts.m+"]"+"</div>");
		$("#guiAbout").append($m);
	},
	updateMesh: function(res){
		var sh, builder, toxiMesh, threeGeometry;
		if(res === undefined){
			res = opts.meshResolution;
		}
		if(threeMesh !== undefined) {
			scene.remove(threeMesh);
		}
		if(opts.changeHarmonics) {
			opts.randomizeHarmonics();
		}
		//get the model
		sh = new toxi.geom.mesh.SphericalHarmonics( opts.m );
		//build the surface
		builder = new toxi.geom.mesh.SurfaceMeshBuilder( sh );
		//make it into a toxiclibs TriangleMesh
		toxiMesh = builder.createMesh(new toxi.geom.mesh.TriangleMesh(),res,1,true);
		//turn the mesh into THREE.Geometry
		threeGeometry = toxi.THREE.ToxiclibsSupport.createMeshGeometry( toxiMesh );
		threeMesh = new THREE.Mesh( threeGeometry, material );
		threeMesh.scale.set(opts.objectRadius,opts.objectRadius,opts.objectRadius);
		scene.add(threeMesh);
	}
};


//GUI
var gui = new dat.GUI();
$("#guidat")
	.find(".guidat")
	.prepend("<div id=\"guiAbout\">"+$("#about").html()+"</div>");

gui.add(opts,"objectRadius")
	.name("Mesh Scale").min(10).max(300)
	.onChange(function(){
		threeMesh.scale.set(opts.objectRadius,opts.objectRadius,opts.objectRadius);
	});
gui.add(material,"wireframe");
gui.add(opts,"meshResolution")
	.name("Mesh Resolution").min(10).max(250).step(1);
gui.add(opts,"changeHarmonics")
	.name("New Random Parameters");
gui.add(opts,"updateMesh")
	.name("Generate New Mesh!");


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
	new toxi.THREE.ToxiclibsSupport( scene ).addParticles(positions, particleMaterial );
}());

//create first mesh
opts.updateMesh();
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