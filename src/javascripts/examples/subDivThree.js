//# Subdivision Basics
//**Usage:** select a subdivision strategy and click "subdivide",
//click "deform" to randomly deform the mesh, click + drag to rotate the mesh
//
//Demonstrates the use of `toxi.geom.mesh.WETriangleMesh` and
//`toxi.geom.mesh.subdiv.*` for mesh subdivision.

require([
	'jquery',
	'three',
	'dat/gui/GUI',
	'toxi/THREE/ToxiclibsSupport',
	'toxi/geom/mesh/Terrain',
	'toxi/geom/AABB',
	'toxi/geom/Sphere',
	'toxi/geom/Vec3D',
	'toxi/geom/mesh/subdiv',
	'toxi/geom/mesh/OBJWriter',
	'toxi/geom/mesh/LaplacianSmooth',
	'toxi/geom/mesh/VertexSelector'
], function( $, THREE, datGui, ToxiclibsSupport, Terrain, AABB, Sphere, Vec3D, subdiv, OBJWriter, LaplacianSmooth, VertexSelector ){

	var $container = $('#example-container'), gui = new datGui();
	var scene, camera, renderer, controls, material, meshes = {};
	$container.width( window.innerWidth );
	$container.height( window.innerHeight - 50 );
	//options for the scene, controlled by the datGui instance
	var options = {
		wireframe: true,
		deformationScalar: 0.4,
		//the different ways to subdivide a WETriangleMesh
		strategies: [
			'MidpointSubdivision',
			'DualSubdivision',
			'TriSubdivision',
			'MidpointDisplacementSubdivision',
			'NormalDisplacementSubdivision'
		],
		selectedStrategy: 'MidpointSubdivision',
		subDivStrategy: new subdiv.MidpointSubdivision(),
		//apply deformations on random vertices
		deform: function(){
			meshes.toxi.getVertices().forEach(function( v ){
				if (Math.random()<0.2) {
					v.scaleSelf( (Math.random()*options.deformationScalar) + 0.8 );
				}
			});
			meshes.toxi.rebuildIndex();
			options.generateTHREEMesh();
		},
		//convert our toxiclibs.js mesh into a new `THREE.Mesh`
		generateTHREEMesh: function(){
			var geom = ToxiclibsSupport.createMeshGeometry( meshes.toxi );
			if( meshes.three !== undefined && scene.children.indexOf( meshes.three ) > -1 ){
				scene.remove( meshes.three );
			}
			meshes.three = new THREE.Mesh( geom, material );
			scene.add( meshes.three );
		},
		resetMesh: function(){
			meshes.toxi = new AABB( new Vec3D(), 200 ).toMesh().toWEMesh();
			options.generateTHREEMesh();
		},
		saveAsOBJ: function(){
			var objfile = new OBJWriter('deformed aabb');
			meshes.toxi.saveAsOBJ( objfile );
			console.log( objfile.getOutput() );
		},
		//apply laplacian smooth on the deformed mesh
		smooth: function(){
			new LaplacianSmooth().filter( new VertexSelector(meshes.toxi), 15 );
			options.generateTHREEMesh();
		},
		//subdivide the mesh using the current subdivision strategy
		subdivide: function(){
			meshes.toxi.subdivide( options.subDivStrategy, 0);
			options.generateTHREEMesh();
		}
	};

	//creating the material once, the three.js mesh will use this
	material = new THREE.MeshLambertMaterial({ color: 0xffffff, wireframe: options.wireframe });
	material.side = THREE.DoubleSide;

	//add everything to the gui
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
	});
	gui.add(options, 'subdivide' );
	gui.add(options,'deformationScalar',0.2,1.0);
	gui.add(options, 'deform');
	gui.add(options, 'smooth');
	gui.add(options,'saveAsOBJ');
	gui.add(options, 'resetMesh').name('reset');

	//setup the three.js scene
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(
		45,
		$container.width()/$container.height(),
		0.1,
		2000
	);
	camera.position.z = 1000;
	//the trackball control for rotating the camera
	controls = new THREE.TrackballControls( camera, $container.get(0) );
	controls.zoomSpeed = 0.01;
	controls.minDistance = 500;
	controls.maxDistance = 2000;
	controls.dynamicDampeningFactor = 0.25;
	//tell three.js to render this with WebGL
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize( $container.width(), $container.height() );
	$container.append( renderer.domElement );
	scene.add( camera );
	//setup the lights
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

	//create the first mesh
	options.resetMesh();
	//start the drawing loop
	draw();
	function draw(){
		controls.update();
		lights.forEach(function( light ){
			light.rotation.set( camera.rotation.x, camera.rotation.y, camera.rotation.z );
		});
		renderer.render( scene, camera );
		//three.js bundles in a `requestAnimationFrame` polyfill so its safe to use
		requestAnimationFrame( draw );
	}

});
