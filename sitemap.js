module.exports = {
	"pages": [{
		"title": "Open-Source Library for Computational Design",
		"template": "index",
		"options": {
			"bodyClasses": [ "index", "no-lock" ],
			"navClasses": [ "light" ]
		},
		"out": "index.html"
	}],

	//each examples tags get mapped to apis and topics
	"topics": [
		{ "id": "Geometry", "tag": "geom"},
		{ "id": "Mesh", "tag": "mesh"},
		{ "id": "Color", "tag": "color" },
		{ "id": "Verlet Physics2d", "tag": "physics2d" },
		{ "id": "Math", "tag": "math" }
	],

	"apis": [
		{ "id": "Canvas 2D", "tag": "canvas" },
        { "id": "D3.js", "tag": "d3" },
		{ "id": "Processing.js", "tag": "pjs" },
		{ "id": "Raphael.js", "tag": "raphael.js" },
		{ "id": "Require.js", "tag": "require" },
		{ "id": "Three.js", "tag": "three.js" },
		{ "id": "WebGL", "tag": "webgl" }
	],

	"examples": [{
        "title": "Theme Discs",
        "src": "themeDiscs.js",
        "thumbnail": "themeDiscs.jpg",
        "tags": "color, d3, require",
        "template": "require"
    },{
        "title": "Multi-color Gradient",
        "src": "multiColorGradient.js",
        "thumbnail": "multiColorGradient.jpg",
        "tags": "color, require",
        "template": "require"
    },
    /*{
		"title": "Subdivision Basics",
		"src": "subDivThree.js",
		"thumbnail": "subdivThree.png",
		"tags": "mesh, three.js, webgl, require",
		"template": "require"
	},{
		"title": "Terrain Noise",
		"src": "terrainNoise.js",
		"template": "require",
		"thumbnail": "additiveWaves.jpg",
		"tags": "mesh, three.js, webgl, require"
	},*/{
		"title": "Spherical Harmonics",
		"src": "sphericalHarmonicsThree.js",
		"template": "empty",
		"tags": "three.js, webgl, mesh",
		"thumbnail": "sphericalHarmonicsThree.jpg",
		"dependencies": [
			"javascripts/vendor/dat.gui.min.js",
			"javascripts/vendor/three.js",
			"javascripts/vendor/jquery.js"
		]
	},{
		"title": "Mesh Align-to-Axis",
		"src": "meshAlignToAxisWebGL.js",
		"template": "canvas2d",
		"thumbnail": "meshAlignToAxisWebGL.jpg",
		"tags": "webgl, mesh"
	},{
		"title": "Super-Ellipsoid",
		"src": "superEllipsoid.pde",
		"template": "pjs",
		"tags": "pjs, webgl, mesh"
	},{
		"title": "Mesh Doodle",
		"src": "meshDoodle.pde",
		"template" : "pjs",
		"tags": "pjs, webgl, mesh"
	},{
		"title": "Line2D Intersection",
		"src": "line2dIntersection.pde",
		"template": "pjs",
		"tags": "pjs, geom"
	},{
		"title": "Arc-Polar Coordinates",
		"src": "arcPolarCoordinates.pde",
		"template": "pjs",
		"tags": "pjs, geom"
	},{
		"title": "Circle from 3 points",
		"src": "circle3Points.pde",
		"template": "pjs",
		"tags": "pjs, geom"
	},{
		"title": "Shiffman Flocking",
		"src": "shiffmanFlockingPjs.pde",
		"template": "pjs",
		"tags": "pjs, misc"
	},{
		"title": "Smooth Doodle",
		"src": "smoothDoodleCanvas.js",
		"template": "canvas2d",
		"tags": "canvas, geom",
		"dependencies": [
			"javascripts/vendor/dat.gui.min.js"
		]
	},{
		"title": "Polar Lines",
		"src": "polarLinesPjs.pde",
		"template": "pjs",
		"tags": "pjs, geom"
	},{
		"title": "Polar Unravel",
		"src": "polarUnravel.pde",
		"template": "pjs",
		"tags": "pjs, geom"
	},{
		"title": "Wheel Insets",
		"src": "wheelInsets.pde",
		"template": "pjs",
		"tags": "pjs, geom"
	},{
		"title": "Additive Waves",
		"src": "additiveWaves.pde",
		"template": "pjs",
		"thumbnail": "additiveWaves.jpg",
		"tags": "pjs, math"
	},{
		"title": "Simplex Noise",
		"src": "simplexNoiseCanvas.js",
		"template": "canvas2d",
		"thumbnail": "simplexNoiseCanvas.jpg",
		"tags": "canvas, math",
		"dependencies": [
			"javascripts/vendor/jquery.js",
			"javascripts/vendor/dat.gui.min.js"
		]
	},{
		"title": "Perlin Noise",
		"src": "perlinNoiseCanvas.js",
		"template": "canvas2d",
		"tags": "canvas, math",
		"dependencies": [
			"javascripts/vendor/dat.gui.min.js"
		]
	},{
		"title": "Attraction 2D",
		"src": "attraction2d.pde",
		"template" : "pjs",
		"tags": "pjs, physics2d"
	},{
		"title": "Draggable Particles",
		"src": "draggableParticles_pjs.pde",
		"template": "pjs",
		"tags": "pjs, physics2d"
	},{
		"title": "Soft-body Square",
		"src": "softBodySquare.pde",
		"template" : "pjs",
		"tags": "pjs, physics2d"
	},{
		"title": "Thread",
		"src": "thread.pde",
		"template": "pjs",
		"tags": "pjs, physics2d"
	},{
		"title": "TColor",
		"src": "tcolorPjs.pde",
		"template": "pjs",
		"tags": "pjs, color"
	},{
		"title": "Color Waves",
		"src": "colorWavesRaphael.js",
		"template": "empty",
		"tags": "raphael.js, color",
		"dependencies": [
			"javascripts/vendor/raphael-min.js"
		]
	}]
};
