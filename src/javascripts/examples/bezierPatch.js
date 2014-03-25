define([
    'three',
    'toxi/THREE/ToxiclibsSupport',
    'toxi/geom/mesh/BezierPatch',
    'toxi/geom/Vec3D',
    'toxi/math/noise/simplexNoise',
    'dat/gui/GUI'
], function( THREE, ToxiclibsSupport, BezierPatch, Vec3D, simplexNoise, DatGui ){

    var container = document.getElementById('example-container'),
        renderer = new THREE.WebGLRenderer(),
        camera = new THREE.PerspectiveCamera( 65, window.innerWidth/window.innerHeight, 0.01, 1000 ),
        scene = new THREE.Scene(),
        controls = new THREE.TrackballControls( camera, renderer.domElement ),
        createGeometry = ToxiclibsSupport.createMeshGeometry,
        size = 100,
        options = {
            amp: size * 1,
            NS: 0.05
        },
        gui = new DatGui(),
        resolutions = [ 2, 4, 10, 20 ];

    camera.position.z = 625;
    gui.add(camera.position,'z', -1000, 1000);
    gui.add(options,'amp', 25, 200);
    gui.add(options,'NS', 0.01, 0.1).step(0.001);
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    var frameCount = 0;

    var updateMesh = function( frameCount, resolution ){
        var phase = frameCount * options.NS * 0.1,
            patch = new BezierPatch(),
            mesh;

        for( var y=0; y<4; y++ ){
            for( var x = 0; x < 4; x++ ){
                var xx = (x * size) - (size),
                    yy = y * size,
                    zz = simplexNoise.noise(xx * options.NS, yy * options.NS, phase) * options.amp;
                patch.set( x, y, new Vec3D(xx, yy, zz));
            }
        }
        mesh = patch.toMesh( resolution );
        //mesh.center(null);
        return mesh;
    };

    var right = new THREE.Vector3(1,0,0);
    var makeGeometry = function(resolution, num){
        var geometry = createGeometry( updateMesh(0, resolution) );

        var patchMesh = new THREE.Mesh(
            geometry,
            new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, wireframe: true})
        );

        patchMesh.position.y = - (num * 50) + ((resolutions.length/2)*50);
        patchMesh.rotation.x = Math.PI / 2;
        //patchMesh.quaternion.setFromAxisAngle( right, Math.PI/2.2 );
        return patchMesh;
    };

    scene.add( camera );

    var patchMeshes = resolutions.map(makeGeometry);

    patchMeshes.forEach(function(mesh){
        scene.add(mesh);
    });


    var drawFrame = function(){
        frameCount++;
        patchMeshes.forEach(function(mesh, i){
            var geometry = mesh.geometry;
            geometry.vertices = createGeometry(updateMesh(frameCount, resolutions[i])).vertices;
            geometry.verticesNeedUpdate = true;
        });
        //createGeometry( updateMesh(frameCount), geometry);
        /*createGeometry( updateMesh(frameCount), geometry);
        mesh = updateMesh( frameCount );*/
        controls.update();
        renderer.render( scene, camera );
        window.requestAnimationFrame( drawFrame );
    };


    drawFrame();

});
