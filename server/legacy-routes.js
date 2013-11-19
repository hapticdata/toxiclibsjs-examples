var _ = require('underscore');

exports = module.exports = function( app ){
    _.each( exports.routes, function( newRoute, oldRoute ){
        app.get('/'+oldRoute, function( req, res ){
            console.log( res );
            res.redirect( newRoute );
        });
    });
};

exports.routes = {
    'index.html' :'',
    'examples/PerlinNoise_canvas.html': 'examples/perlin-noise-canvas',
    'examples/SimplexNoise_canvas.html': 'examples/simplex-noise-canvas',
    'examples/AdditiveWaves_pjs-webgl.html': 'examples/additive-waves',
    'examples/SphericalHarmonics_threejs.html': 'examples/spherical-harmonics-three',
    'examples/SmoothDoodle_canvas.html': 'examples/smooth-doodle-canvas',
    'examples/PolarUnravel_pjs.html': 'examples/polar-unravel',
    'examples/Circle3Points_pjs.html': 'examples/circle3-points',
    'examples/Line2DIntersection_pjs.html': 'examples/line2d-intersection',
    'examples/SuperEllipsoidMeshBuilder_pjs-webgl.html': 'examples/super-ellipsoid',
    'examples/MeshAlignToAxis_webgl.html': 'examples/mesh-align-to-axis-web-g-l',
    'examples/MeshDoodle_pjs-webgl.html': 'examples/mesh-doodle',
    'examples/ShiffmanFlocking_pjs.html': 'examples/shiffman-flocking-pjs',
    'examples/PolarLines_pjs.html': 'examples/polar-lines-pjs',
    'examples/ColorWaves_raphael.html': 'examples/color-waves-raphael',
    'examples/TColor_pjs.html': 'examples/tcolor-pjs',
    'examples/WheelInsets_pjs.html': 'examples/wheel-insets',
    'examples/ArcPolarCoordinates_pjs.html': 'examples/arc-polar-coordinates',
    'examples/Attraction2D_pjs.html': 'examples/attraction2d',
    'examples/DraggableParticles_pjs.html': 'examples/draggable-particles-pjs',
    'examples/SoftBodySquare_pjs.html': 'examples/soft-body-square',
    'examples/ThreadDemo_pjs.html': 'examples/thread'
};
