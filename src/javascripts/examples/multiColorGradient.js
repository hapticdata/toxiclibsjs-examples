define(['toxi/color/ColorGradient', 'toxi/color/TColor', 'toxi/util/datatypes/FloatRange'], function( ColorGradient, TColor, FloatRange ){

    return function(){

        var container = document.getElementById('example-container'),
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            gradient = new ColorGradient(),
            range;


        canvas.width = window.innerWidth;
        canvas.height = 1;
        if( window.devicePixelRatio >= 2 ){
            canvas.style.width = canvas.width + 'px';
            canvas.width *= 2;
        }

        range = new FloatRange(0, canvas.width);

        window.ColorGradient = ColorGradient;
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
    };
});
