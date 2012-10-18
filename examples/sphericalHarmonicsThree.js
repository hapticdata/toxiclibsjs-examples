

var container = document.getElementById('example-container'),
	$m = $("#m"),
	mouse = new toxi.geom.Vec2D(),
	cameraSensitivity = 1.2,
	stage = new toxi.geom.Vec2D(window.innerWidth,window.innerHeight),
	canRotateWorld = true,
	camera = new THREE.PerspectiveCamera( 45, stage.x / stage.y, 1, 2000),
		/*{
		fov: 45, 
		aspect: stage.x / stage.y,
		near: 1,
		far: 2000,
		rotateSpeed: 1.0,
		noPan: true,
		noZoom: false,
		staticMoving: false,
		dynamicDampingFactor: 0.05
	}),*/
	scene = new THREE.Scene(),
	renderer = new THREE.WebGLRenderer({antiaalised: true}),
	//stats = new Stats(),
	objectRadius = 65,
	meshResolution = 100,
	m = [],
	changeHarmonics = true,
	toxiToThreeSupport = new toxi.THREE.ToxiclibsSupport(scene),
	threeMesh = undefined; //<--we'll put the converted mesh here

camera.position.z = 800;

scene.add( camera );
var controls = new THREE.TrackballControls( camera );
controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.2;

controls.noZoom = false;
controls.noPan = false;

controls.staticMoving = false;
controls.dynamicDampingFactor = 0.1;

renderer.setSize(stage.x,stage.y);
container.appendChild(renderer.domElement);

/*stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
container.appendChild( stats.domElement );*/

///the stuff more unique to this sketch
var material = new THREE.MeshNormalMaterial({color: 0xBAE8E6, opacity: 1.0});
//randomizeHarmonics();
m = [5,8,3,1,7,3,3,7];
//GUI
var gui = new DAT.GUI();
$("#guidat").find(".guidat").prepend('<div id="guiAbout">'+$("#about").html()+"</div>")

gui.add(this,"objectRadius").name("Mesh Scale").min(10).max(300).onChange(function(){
	threeMesh.scale = new THREE.Vector3(objectRadius,objectRadius,objectRadius);
});
gui.add(material,"wireframe");
gui.add(this,"meshResolution").name("Mesh Resolution").min(10).max(250).step(1);
gui.add(this,"changeHarmonics").name("New Random Parameters");
gui.add(this,"changeMesh").name("Generate New Mesh!");

function animate() { 
	requestAnimationFrame( animate );
	render();
	//stats.update();
}

function render() {
	/*if(canRotateWorld){
		camera.position.x += ( (mouse.x*cameraSensitivity) - camera.position.x ) * 0.05;
		camera.position.y += ( - ( mouse.y * cameraSensitivity) - camera.position.y ) * 0.05;
	}*/
	controls.update();
	renderer.render( scene, camera );
}

animate();

function randomizeHarmonics(){
	m = [];
	for(var i=0; i<8; i++) {
	  m.push(parseInt(Math.random()*9));
	}
	$m.remove();
	$m = $('<div id="m">m: ['+m+']'+'</div>');
	$("#guiAbout").append($m)
}



function changeMesh(res){
	if(res === undefined){
		res = meshResolution;
	}
	if(threeMesh !== undefined) {
		scene.remove(threeMesh);
	}
	if(changeHarmonics) {
		randomizeHarmonics();
	}
	var sh = new toxi.geom.mesh.SphericalHarmonics(m);
	var mesh = new toxi.geom.mesh.SurfaceMeshBuilder( sh ); 
	var toxiMesh = mesh.createMesh(new toxi.geom.mesh.TriangleMesh(),res,1,true);
	threeMesh = toxiToThreeSupport.addMesh(toxiMesh,material);
	//threeMesh = new THREE.Mesh(toxiToThreeSupport.createGeometry(toxiMesh),material);
	threeMesh.scale = new THREE.Vector3(objectRadius,objectRadius,objectRadius);
	threeMesh.doubleSided = true;
	//console.log(threeMesh);
	scene.add(threeMesh);
};


document.onmousemove = (function(){
	var halfWindow = stage.scale(0.5);
	return 	function (event) {
		mouse.x = ( event.clientX - halfWindow.x );
		mouse.y = ( event.clientY - halfWindow.y );
	}
})();

//create first mesh
changeMesh(meshResolution);
var positions = [];
for(var k=0;k<500;k++){
	var p = positions.push(toxi.geom.Vec3D.randomVector().scale(200+Math.random()*300));
}
toxiToThreeSupport.addParticles(positions, new THREE.ParticleBasicMaterial({
	color: 0xffff00,
	transparent: true,
	blending: THREE.AdditiveBlending
}));