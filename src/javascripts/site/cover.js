define([
    'jquery',
    'underscore',
    'toxi/geom/Circle',
    'toxi/geom/Ray2D',
    'toxi/geom/Line2D',
    'toxi/geom/Vec2D',
    'toxi/color/TColor',
    'toxi/util/datatypes/FloatRange'
], function( $, _, Circle, Ray2D, Line2D, Vec2D, TColor, FloatRange ){
    var defaults = {
        numCircles: 100,
        minRadius: 5,
        maxRadius: 25,
        maxDistance: 1000
    };

    return function app(settings){
        settings = _.defaults(settings||{}, defaults);

        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            circles,
            mouse = new Vec2D(),
            radiusRange = new FloatRange(settings.minRadius, settings.maxRadius);

        document.body.appendChild(canvas);

        var makeCircle = function(){
            return new Circle( new Vec2D(canvas.width,canvas.height).scaleSelf(Math.random(),Math.random()), radiusRange.pickRandom() );
        };

        var draw = {
            circle: function(ctx, circle){
                ctx.beginPath();
                ctx.arc(circle.x, circle.y, circle.getRadius(), 0, Math.PI*2);
                ctx.closePath();
            },
            line: function(ctx, line, isLineStrip){
                if( !isLineStrip ){
                    ctx.beginPath();
                }
                ctx.moveTo( line.a.x, line.a.y );
                ctx.lineTo( line.b.x, line.b.y );
                if( !isLineStrip ){
                    ctx.closePath();
                }
            },
            ray: function( ctx, ray, distance ){
                distance = distance || 1000;
                var line2d = ray.toLine2DWithPointAtDistance(300);//distance);
                line2d.a = ray.toLine2DWithPointAtDistance(50).b;
                draw.line( ctx, line2d);
            }
        };


        canvas.width = window.innerWidth;
        canvas.height = 720;

        circles = _.map( _.range(settings.numCircles), makeCircle );


        var dot = new Circle();
        ctx.strokeStyle = TColor.newGray( 1.0 ).toHexCSS();
        ctx.lineWidth = 1;

        var drawFrame = function(){
            var tans = [];
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            _.each( circles, function(circle){
                if( circle.distanceTo(mouse) > settings.maxDistance ) {
                    return;
                }
                var tangents = circle.getTangentPoints(mouse);
                dot.set(circle);
                dot.setRadius(2);
                //draw.circle(ctx, circle);
                //ctx.stroke();
                //draw.circle(ctx, dot);
                //ctx.fill();
                tans.push(tangents);
                var length = Math.random() * 250;
                _.each(tangents, function(tan){
                    //dot.set(tan);
                    //dot.setRadius(6);
                    //draw.circle( ctx, dot );
                    var ray = new Ray2D( mouse, tan.sub(mouse) );
                    dot.set( ray.getPointAtDistance(length) );
                    dot.setRadius(6);
                    draw.circle( ctx, dot );
                    draw.ray( ctx, ray, length );
                    ctx.fill();
                });
            });

            /*_.each( tans, function(tangents, i, list){
                if( i < list.length-1 ){
                    var next = tangents[i+1];
                    _.each(next, function(t){
                        draw.line(ctx, tangentsls, t);
                    });
                }
            });*/
        };


        document.addEventListener('mousemove', function(evt){
            mouse.set( evt.pageX, evt.pageY );
            drawFrame();
        }, false);
        drawFrame();

    };
});
