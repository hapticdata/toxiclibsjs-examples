console.log('subdiv');
//#Subdivision Basics
require([
	'jquery',
	'three',
	'dat/gui/GUI',
	'toxi/THREE/ToxiclibsSupport',
	'toxi/geom/AABB',
	'toxi/geom/Sphere',
	'toxi/geom/Vec3D',
	'toxi/geom/mesh/subdiv',
	'toxi/geom/mesh/OBJWriter'
	//'toxi/geom/mesh/LaplacianSmooth'
], function( $, THREE, datGui, ToxiclibsSupport, AABB, Sphere, Vec3D, subdiv, OBJWriter, LaplacianSmooth ){
	console.log('three', THREE );
	var $container = $('#example-container'), gui = new datGui();
	var scene, camera, renderer, controls, meshes = {};
	$container.width( window.innerWidth );
	$container.height( window.innerHeight );

	var options = {
		'wireframe': true,
		'selectedGeometry': [ 'AABB', 'Sphere' ],
		'deformationScalar': 0.4,
		'strategies': [
			'MidpointSubdivision',
			'DualSubdivision',
			'TriSubdivision',
			'MidpointDisplacementSubdivision',
			'NormalDisplacementSubdivision'
		],
		'selectedStrategy': 'MidpointSubdivision',
		'subDivStrategy': new subdiv.MidpointSubdivision(),
		'subdivide': function(){
			meshes.toxi.subdivide( options.subDivStrategy, 0);
			makeTHREEMesh();
		},
		'deform': function(){
			meshes.toxi.getVertices().forEach(function( v ){
				if (Math.random()<0.2) {
					v.scaleSelf( (Math.random()*options.deformationScalar) + 0.8 );
				}
			});
			meshes.toxi.rebuildIndex();
			makeTHREEMesh();
		},
		'smooth': function(){
			new LaplacianSmooth().filter( meshes.toxi, 1);
			makeTHREEMesh();
		},
		saveAsOBJ: function(){
			var objfile = new OBJWriter('deformed aabb');
			meshes.toxi.saveAsOBJ( objfile );
			console.log( objfile.getOutput() );
		}
	};

	gui.add( options, 'wireframe').onChange(function(){
		meshes.three.material.wireframe = options.wireframe;
	});
	gui.add(options, 'selectedStrategy', options.strategies).name('Strategy').onChange(function(){
		var Constructor = subdiv[options.selectedStrategy];
		if( options.selectedStrategy === 'MidpointDisplacementSubdivision' ){
			options.subDivStrategy = new Constructor(meshes.toxi.computeCentroid(), -0.22 );
		} else if( options.selectedStrategy == 'NormalDisplacementSubdivision' ){
			options.subDivStrategy = new Constructor(0.15);
		} else {
			options.subDivStrategy = new Constructor();
		}
		console.log( options.subDivStrategy.computeSplitPoints );
	});
	gui.add(options, 'subdivide' );
	gui.add(options,'deformationScalar',0.2,1.0);
	gui.add(options, 'deform');
	gui.add(options, 'smooth');
	gui.add(options,'saveAsOBJ');

	function makeTHREEMesh(){
		var geom = ToxiclibsSupport.createMeshGeometry( meshes.toxi );
		var material = new THREE.MeshLambertMaterial({ color: 0xffffff, wireframe: options.wireframe });
		material.side = THREE.DoubleSide;
		if( meshes.three !== undefined && scene.children.indexOf( meshes.three ) > -1 ){
			scene.remove( meshes.three );
		}
		meshes.three = new THREE.Mesh( geom, material );
		meshes.three.scale.set( 100, 100, 100 );
		scene.add( meshes.three );
	}
	
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(
		45,
		$container.width()/$container.height(),
		0.1,
		2000
	);
	camera.position.z = 1000;
	window.camera = camera;
	controls = new THREE.TrackballControls( camera, $container.get(0) );
	//controls.panSpeed = 0.1;
	controls.zoomSpeed = 0.01;
	controls.minDistance = 500;
	controls.maxDistance = 2000;
	controls.dynamicDampeningFactor = 0.25;
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize( $container.width(), $container.height() );
	scene.add( camera );
	var lights = [];
	scene.add( new THREE.AmbientLight( 0x333333) );
	var spot = new THREE.SpotLight( 0x33ccaa, 0.5 );
	spot.position.set( -500, 1000, 0 );
	lights.push( spot );
	scene.add( spot );
	spot = new THREE.SpotLight( 0xffffff, 0.85 );
	spot.position.set( 500, -1000, 0 );
	scene.add( spot );
	lights.push( spot );
	spot = new THREE.SpotLight( 0x8f5eff, 0.5 );
	spot.position.set( 0, 0, 1000 );
	scene.add( spot );
	lights.push( spot );
	$container.append( renderer.domElement );

	new AABB( new Vec3D(), 2 ).toMesh().toWEMesh(function( wemesh ){
		meshes.toxi = wemesh;
		makeTHREEMesh();
	});

	draw();
	window.lights = lights;
	function draw(){
		controls.update();
		lights.forEach(function( light ){
			light.rotation.set( camera.rotation.x, camera.rotation.y, camera.rotation.z );
		});
		renderer.render( scene, camera );
		requestAnimationFrame( draw );
	}

});