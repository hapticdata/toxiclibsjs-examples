require([
    'toxi/geom/Vec2D',
    'toxi/geom/mesh2d/Voronoi'
], function( Vec2D, Voronoi ){

    var testPoints = [
        new Vec2D(697.95703,289.80762),
        new Vec2D(97.99485,447.40286),
        new Vec2D(606.4321,340.3783),
        new Vec2D(285.58044,279.95786)
    ];

    console.log(testPoints);

    var container = document.getElementById('example-container'),
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
    // empty voronoi mesh container
        voronoi = new Voronoi(),
        showPoints = true,
        showDelaunay = true;

    canvas.width = 960;
    canvas.height = 600;
    container.appendChild( canvas );

    //ctx.translate(canvas.width/2,canvas.height/2);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;


    var drawRegions = function(){
        var regions = voronoi.getRegions();
        console.log("regions",regions);
        regions.forEach(function(poly,i){
            ctx.beginPath();
            poly.vertices.forEach(function(vert,i){
                if(i==0){
                    ctx.moveTo(vert.x,vert.y);
                } else {
                    ctx.lineTo(vert.x,vert.y);
                }
            });
        });
        ctx.closePath();
        ctx.stroke();
    };

    var drawSites = function(){
        var sites = voronoi.getSites();
        sites.forEach(function(vec,i){
            ctx.fillRect(vec.x,vec.y,2,2);
        });
    };

    voronoi.addPoints(testPoints);
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#ff00ff";
    drawRegions();
    drawSites();

    document.onmousedown = function(e){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        //voronoi.addPoint(testPoints.shift());
    };
});