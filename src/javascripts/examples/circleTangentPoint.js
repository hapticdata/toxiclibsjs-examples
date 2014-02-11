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
        mouse = new Vec2D(0,0),
        circle,
        colorList = createListUsingStrategy('compound', TColor.X11.azure.copy()),
        color1 = colorList.get(0).toRGBACSS(),
        color2 = colorList.get(1).toRGBACSS(),
        color3 = colorList.get(2).toRGBACSS(),
        color4 = colorList.get(3).toRGBACSS(),
        color5 = colorList.get(4).toRGBACSS(),
        drawFrame;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 50;
    container.appendChild( canvas );

    circle = new Circle( canvas.width/2, canvas.height/2, canvas.width*0.1);
    mouse.set( canvas.width, canvas.height ).scaleSelf(0.5);

    //operations to draw geometry on the canvas with Canvas2DRenderingContext
    var draw = {
        circle: function( c ){
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.getRadius(), 0, Math.PI * 2 );
            ctx.closePath();
        },
        line: function( line ){
            ctx.beginPath();
            ctx.moveTo(line.a.x, line.a.y);
            ctx.lineTo(line.b.x, line.b.y);
            ctx.closePath();
        }
    };

    //draw on the canvas
    drawFrame = function(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        var line = new Line2D(mouse, circle);
        ctx.strokeStyle = color1;
        draw.circle( circle );
        ctx.stroke();
        ctx.strokeStyle = color2;
        draw.line( line );
        ctx.stroke();
        draw.circle(new Circle(line.getMidPoint(), line.getLength()/2));
        ctx.stroke();
        var isecs = circle.getTangentPoints(mouse);
        if( isecs ){
            //for every intersection get the ray that casts from the mouse to that point
            isecs.forEach(function( isec ){
                var ray = new Ray2D(mouse, isec.sub(mouse)),
                    rayLine = ray.toLine2DWithPointAtDistance(canvas.width);
                ctx.strokeStyle = color3;
                draw.line( new Line2D(circle, isec) );
                ctx.stroke();
                ctx.strokeStyle = color4;
                draw.line( rayLine );
                ctx.stroke();
                ctx.fillStyle = color5;
                draw.circle( new Circle(isec, 5) );
                ctx.fill();
            });
        }
    };

    //every time the mouse moves, update the vec2d and redraw the canvas
    canvas.addEventListener('mousemove', function(evt){
        mouse.set( evt.pageX, evt.pageY );
        drawFrame();
    }, false);

    //draw the canvas once to start
    drawFrame();


});
