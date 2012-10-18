//#Terrain
//##with [Three.js](http://mrdoob.github.com/three.js) and [Require.js](http://requirejs.org)
//**toxiclibs.js by [Kyle Phillips](http://haptic-data.com)**
//
//Demonstrates [toxi.geom.mesh.TriangleMesh](https://github.com/hapticdata/toxiclibsjs/blob/master/lib/toxi/geom/mesh/TriangleMesh.js) and [toxi.math.noise.PerlineNoise]
//and using [toxi.THREE.ToxiclibsSupport](https://github.com/hapticdata/toxiclibsjs/blob/master/lib/toxi/THREE/ToxiclibsSupport.js) for generating a [three.js] mesh.

require.config({
	shim: {
		//[shim](http://requirejs.org/docs/api.html#config-shim) makes non-AMD libs like THREE work within Require
		'three': { exports: 'THREE' }
	}
});
//array of dependencies
require([
	'three',
	'dat/gui/GUI',
	'toxi/THREE/ToxiclibsSupport',
	'toxi/geom/mesh/Terrain',
	'toxi/geom/Vec3D',
	'toxi/geom/mesh/TriangleMesh',
	'toxi/math/mathUtils',
	'toxi/math/noise/PerlinNoise'
], function(THREE, datGUI, ToxiclibsSupport, Terrain, Vec3D, TriangleMesh, mathUtils, PerlinNoise ){

	var gui = new datGUI();
	var container = document.getElementById('example-container'),
		width = window.innerWidth,
		height = window.innerHeight - 100,
		scene = new THREE.Scene(),
		camera = new THREE.PerspectiveCamera( 45, width / height, 0.1, 10000 ),
		renderer = new THREE.WebGLRenderer({ antialias: true }),
		WDIM = 40,
		HDIM = 30,
		terrain = new Terrain( WDIM, HDIM, 50 ),
		perlin = new PerlinNoise(),
		offset = 0,
		frameCount = 0,
		threeMesh,
		options;

	options = {
		running: true,
		noiseScale: 1.0,
		speed: 1.0
	};

	gui.add(options, 'running' ).onChange(function(){
		//if running was previously false, kick-start draw again
		if( options.running ){ draw(); }
	});

	gui.add(options, 'noiseScale', 0.5, 1.0 ).step(0.01);
	gui.add(options, 'speed', 0.5, 1.5).step(0.01);

	camera.position.z = 3000;
	camera.position.y = 1000;
	camera.lookAt( new THREE.Vector3() );
	container.style.width = width;
	container.style.height = height;
	renderer.setSize( width, height );
	container.appendChild( renderer.domElement );

	//update the elevation of the terrain based on frameCount
	function updateElevations( frame ){
		var amp = 200 * Math.sin( frame ) + 10;
		var elevation = [];
		offset += options.speed;
		perlin.noiseSeed( 23 );
		for (var z = 0, i = 0; z < HDIM; z++) {
			for (var x = 0; x < WDIM; x++) {
				elevation[i++] = (perlin.noise( x * options.noiseScale ,  offset + z * options.noiseScale ) * amp) - amp;
			}
		}
		terrain.setElevation(elevation);
	}
	//create a THREE.Mesh from the toxiclibs.js terrain
	threeMesh = ToxiclibsSupport.createMesh(
		terrain.toMesh(),
		new THREE.MeshPhongMaterial({color: 0xffffff, wireframe: false })
	);

	threeMesh.rotation.x = Math.PI;
	threeMesh.scale.set( 3, 3, 3);

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
		var newGeom;

		frameCount++;
		updateElevations( frameCount / 100 );
		threeMesh.dynamic = true;
		//get a new geometry for the changed terrain
		newGeom = ToxiclibsSupport.createMeshGeometry( terrain.toMesh() );
		//update all of the vertices
		(function(){
			var g = threeMesh.geometry;
			g.vertices.forEach(function(v, i){
				v.set( newGeom.vertices[i].x, newGeom.vertices[i].y, newGeom.vertices[i].z );
			});
			g.computeFaceNormals();
			g.computeVertexNormals();
			g.verticesNeedUpdate = true;
			g.normalsNeedUpdate = true;
		}());
		renderer.render( scene, camera );
		
		if( options.running ){
			//three.js bundles a polyfill, so this will work fine in all browsers
			window.requestAnimationFrame( draw );
		}
	}
	draw();
});
