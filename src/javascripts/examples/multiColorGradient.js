define([
    'dat/gui/GUI',
    'toxi/internals',
    'toxi/color/ColorGradient',
    'toxi/color/TColor',
    'toxi/util/datatypes/FloatRange'
], function( datGui, internals, ColorGradient, TColor, FloatRange ){

    var each = internals.each,
        buildGui;

    buildGui = function( app ){

    };

    return function(){

        var container = document.getElementById('example-container'),
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            gradient = new ColorGradient(),
            range;



        var toLinearGradientCSS = (function(){
            //find out if there should be a vendor prefix
            var styles = window.getComputedStyle(document.documentElement, ''),
                pre = (Array.prototype.slice
                    .call(styles)
                    .join('')
                    .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
                    )[1];

            return function( grad, width, angle ){
                angle = angle || "left";
                var stops = [];
                each(grad.getGradientPoints(), function(gradPoint){
                    stops.push(gradPoint.getColor().toRGBACSS() +' '+Math.round((gradPoint.getPosition()/width)*100)+'%');
                });

                console.log( 'stops: ', stops);
                var css = "";
                var stopsStr = stops.toString();
                css += '-'+pre+'-linear-gradient(' +angle+ ', ' +stopsStr+ ')';
                return css;
            };
        })();

        window.gradient = gradient;
        window.toLinearGradientCSS = toLinearGradientCSS;
        canvas.width = window.innerWidth;
        canvas.height = 1;
        if( window.devicePixelRatio >= 2 ){
            canvas.style.width = canvas.width + 'px';
            canvas.width *= 2;
        }

        range = new FloatRange(0, canvas.width);

        canvas.style.webkitTransformOrigin = 'top left';
        canvas.style.webkitTransform = 'scaleY('+(window.innerHeight-50)+')';
        container.style.height = (window.innerHeight - 50) + 'px';
        container.style.position = 'relative';
        container.style.top = '-15px';
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        window.canv = canvas;

        gradient.addColorAt(0, TColor.newRandom());
        gradient.addColorAt(range.getAt(0.5), TColor.newRandom());
        gradient.addColorAt(range.getAt(0.75), TColor.newRandom());
        gradient.addColorAt(range.getAt(1.0), TColor.newRandom());

        var imageData = ctx.createImageData(canvas.width,1);
        var list = gradient.calcGradient(0,canvas.width);
        for( var i=0, l = list.size(); i<l; i++ ){
            list.colors[i].toRGBADecimalArray(imageData.data, 4*i);
        }
        ctx.putImageData(imageData,0,0);


        container.appendChild( canvas );


        var div = document.createElement('div');
        div.style.width = '200px';
        div.style.height = '75px';
        div.style.position = 'absolute';
        div.style.top = '20px';
        div.style.left = '10px';
        div.style.border = '1px solid black';

        container.appendChild( div );

        div.style.backgroundImage = toLinearGradientCSS( gradient, canvas.width );


    };
});
