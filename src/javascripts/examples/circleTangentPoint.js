//# Circle Tangent Points
define([
    'toxi/geom/Vec2D',
    'toxi/geom/Circle',
    'toxi/geom/Line2D',
    'toxi/geom/Ray2D',
    'toxi/color/TColor',
    'toxi/color/createListUsingStrategy'
], function( Vec2D, Circle, Line2D, Ray2D, TColor, createListUsingStrategy ){

    var container = document.getElementById('example-container'),
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        p = new Vec2D(0,0),
        colorList = createListUsingStrategy('complementary', TColor.X11.teal.copy().setAlpha(0.5).setBrightness(0.9)),
        color1 = TColor.newHex('f5f5f5').toRGBACSS(),//colorList.getRandom().setAlpha(0.5).toRGBACSS(),
        color2 = color1, //colorList.getRandom().toRGBACSS(),
        color3 = color2; //colorList.getRandom().toRGBACSS();


    container.appendChild( canvas );

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 50;
    p.set( canvas.width, canvas.height ).scaleSelf(0.5);

    var draw = {
        circle: function( ctx, c){
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.getRadius(), 0, Math.PI * 2 );
            ctx.closePath();
        },
        line: function( ctx, line){
            ctx.moveTo(line.a.x, line.a.y);
            ctx.lineTo(line.b.x, line.b.y);
        },
        ray: function( ctx, ray, distance ){
            distance = distance || 1000;
            var line2d = ray.toLine2DWithPointAtDistance(distance);
            draw.line( ctx, line2d);
        },
        tangents: function(ctx, p, circle){
            var l = new Line2D(p, circle);
            ctx.strokeStyle = color1;
            draw.circle( ctx, circle );
            draw.line( ctx, l );
            ctx.stroke();
            var isecs = circle.getTangentPoints(p);
            if( isecs ){
                isecs.forEach(function(isec){
                    ctx.strokeStyle = color2;
                    draw.circle( ctx, new Circle(isec, 5));
                    ctx.stroke();
                    draw.ray( ctx, new Ray2D(p, isec.sub(p)), canvas.width );
                    ctx.strokeStyle = color3;
                    draw.line(ctx, { a: circle, b: isec });
                    ctx.stroke();
                });

                draw.circle(ctx, new Circle(l.getMidPoint(), l.getLength()/2));
                ctx.stroke();
            }
        }
    };


    var circles = [];
    for(var i=0; i<1; i++){
        circles.push( new Circle( canvas.width/2, canvas.height/2, canvas.width*0.1) );//new Circle( Math.random()*canvas.width, Math.random()*canvas.height, Math.random()*100 + 50 ) );
    }

    //draw the canvas
    var drawFrame = function(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        circles.forEach(function( circle ){
            draw.tangents( ctx, p, circle );
        });
    };

    //every time the mouse moves, update the vec2d and redraw the canvas
    canvas.addEventListener('mousemove', function(evt){
        p.set( evt.pageX, evt.pageY );
        drawFrame();
    }, false);

    //draw the canvas once to start
    drawFrame();


});
