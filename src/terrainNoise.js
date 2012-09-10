//#Terrain
//##with [Three.js](http://mrdoob.github.com/three.js) and [Require.js](http://requirejs.org)
//**toxiclibs.js by [Kyle Phillips](http://haptic-data.com)**
//
require.config({
	baseUrl: 'javascripts/',
	paths: { 
		'toxi': '//localhost/~me/libs/toxiclibsjs/working_dir/lib/toxi'
	},
	shim: {
		//[shim](http://requirejs.org/docs/api.html#config-shim) makes non-AMD libs like THREE work within Require
		'three': { exports: 'THREE' }
	}
});

require([
	'three',
	'dat/gui/GUI',
	'toxi/THREE/ToxiclibsSupport',
	'toxi/geom/mesh/Terrain',
	'toxi/geom/Vec3D',
	'toxi/geom/Vec2D',
	'toxi/geom/mesh/TriangleMesh',
	'toxi/math/mathUtils',
	'toxi/geom/Rect',
	'toxi/geom/IsectData3D',
	'toxi/geom/AABB',
	'toxi/geom/Sphere',
	'toxi/math/noise/PerlinNoise',
], function(THREE, datGUI, ToxiclibsSupport, Terrain,
	Vec3D, Vec2D, TriangleMesh, mathUtils, Rect, IsectData3D, AABB, Sphere, PerlinNoise ){

	var gui = new datGUI();
	var container = document.getElementById('example-container'),
		width = window.innerWidth,
		height = window.innerHeight - 100,
		scene = new THREE.Scene(),
		camera = new THREE.PerspectiveCamera( 45, width / height, 0.1, 10000 ),
		renderer = new THREE.WebGLRenderer({ antialias: true }),
		NOISE_SCALE = 1.0,
		WDIM = 40,
		HDIM = 30,
		camOffset = new Vec3D( 0, 100, 300),
		eyePos = new Vec3D( 0, 1000, 0 ),
		toxiToThree = new ToxiclibsSupport( scene ),
		terrain = new Terrain( WDIM, HDIM, 50 ),
		perlin = new PerlinNoise(),
		controls = new THREE.TrackballControls( camera ),
		offset = 0,
		frameCount = 0;

	camera.position.z = 3000;
	camera.position.y = 1000;
	camera.lookAt( new THREE.Vector3() );
	container.style.width = width;
	container.style.height = height;
	renderer.setSize( width, height );
	container.appendChild( renderer.domElement );


	function randomizeElevations( frame ){
		var amp = 200 * Math.sin( frame ) + 10;
		var elevation = [];
		offset += 1.0;
		perlin.noiseSeed( 23 );
		for (var z = 0, i = 0; z < HDIM; z++) {
			for (var x = 0; x < WDIM; x++) {
				elevation[i++] = (perlin.noise( x * NOISE_SCALE ,  offset + z * NOISE_SCALE ) * amp) - amp;
				//console.log(elevation[i-1]);
			}
		}
		terrain.setElevation(elevation);
	}
	
	var triangleMesh = terrain.toMesh(),
		sphere = new Sphere( (50 * WDIM) / 2);

	//go through all faces, if it isnt inside sphere, remove

	var threeMesh = ToxiclibsSupport.createMesh( 
		terrain.toMesh(),
		new THREE.MeshPhongMaterial({color: 0xffffff, wireframe: false })
	);

	window.threeMesh = threeMesh;

	threeMesh.material.doubleSided = true;
	threeMesh.rotation.x = Math.PI;
	threeMesh.scale.set( 3, 3, 3);

	var threeSphere = ToxiclibsSupport.createMesh(
		sphere.toMesh( new TriangleMesh("sphere"), 5 ),
		new THREE.MeshLambertMaterial({ 
			color: 0x0000ff, 
			wireframe: true
		})
	);

	//scene.add( threeSphere );
	scene.add( camera );
	scene.add( threeMesh );
	var light1 = new THREE.DirectionalLight(0x0000ff, 0.5);
	light1.position.set(0.25,0.0,0.5).normalize();
	scene.add(light1);
	var light2 = new THREE.DirectionalLight(0x66ff66, 0.5);
	light2.position.set(-0.25,0,0.5).normalize();
	scene.add(light2);
	scene.add( new THREE.AmbientLight( 0x333333 ) );

	function draw(){
		frameCount++;
		var geometry = threeMesh.geometry;
		randomizeElevations( frameCount / 100 );//this.frameCount / 100);
		threeMesh.dynamic = true;
		var newGeom = ToxiclibsSupport.createMeshGeometry( terrain.toMesh() );
		geometry.vertices.forEach(function(v, i){
			v.set( newGeom.vertices[i].x, newGeom.vertices[i].y, newGeom.vertices[i].z );
		});
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();
		/*terrain.toMesh().vertices.forEach(function(v, i ){
			geometry.vertices[i].set(v.x,v.y,v.z);
		});*/
		geometry.verticesNeedUpdate = true;
		geometry.elementsNeedUpdate = true;
		geometry.morphTargetsNeedUpdate = true;
		geometry.uvsNeedUpdate = true;
		geometry.normalsNeedUpdate = true;
		geometry.colorsNeedUpdate = true;
		geometry.tangentsNeedUpdate = true;		
		//controls.update();
		renderer.render( scene, camera );
		//threeMesh.rotation.x += 0.0025;
		window.requestAnimationFrame( draw );
	}
	draw();
});
