//# Multi-color Gradient
//**Usage:** A random gradient is generated using a color theory strategy and displayed in both canvas and CSS.
//Use the gui in the upper-right to manipulate the gradient and add more colors.
define([
    'dat/gui/GUI',
    'extras/gui/addTColor',
    'toxi/internals',
    'toxi/color/ColorGradient',
    'toxi/color/TColor',
    'toxi/color/theory/colorTheoryRegistry',
    'toxi/util/datatypes/FloatRange'
], function( DatGui, addTColor, internals, ColorGradient, TColor, colorTheoryRegistry, FloatRange ){

    var each = internals.each,
        mixin = internals.mixin,
        buildGui,
        createGradient,
        prefix,
        toLinearGradientCSS,
        last;

    last = function( arr ){ return arr[arr.length-1]; };

    //Create a [ColorGradient](https://github.com/hapticdata/toxiclibsjs/blob/master/lib/toxi/color/ColorGradient.js)
    //convert it to an array of pixels to use on a canvas and
    //convert it to a string to use as a CSS linear-gradient.
    createGradient = function(){
        var container = document.getElementById('example-container'),
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            gradientFromStrategy,
            cssGradientEl,
            gradient,
            posComparator,
            drawOnCanvas,
            range,
            exports = {};

        canvas.width = window.innerWidth;
        //this canvas is just 1px tall, set css-height to scale it
        canvas.height = 1;
        canvas.style.height = '500px';
        //if your on a retina display, create a high-res canvas
        if( window.devicePixelRatio >= 2 ){
            canvas.style.width = canvas.width + 'px';
            canvas.width *= 2;
        }

        //create a range to interpolate numbers between min and max
        range = new FloatRange(0, canvas.width);

        //generate a ColorGradient using a strategy from `toxi.color.theory.*`
        //provide an array of numbers between 0-1.0 for positions on the gradient
        gradientFromStrategy = function gradientFromStrategy(strategy, positions){
            var gradient = new ColorGradient();
            strategy
                .createListFromColor(TColor.newRandom().setSaturation(0.8))
                .each(function(color,i){
                    gradient.addColorAt(range.getAt(positions[i]), color);
                });
            return gradient;
        };

        //create a ColorGradient using the "Split Complementary" strategy
        gradient = gradientFromStrategy(colorTheoryRegistry.SPLIT_COMPLEMENTARY, [0,0.35,0.6,0.75,0.85,1.0]);

        //create the box in the upper-left that has
        //the ColorGradient applied as a CSS linear-gradient
        cssGradientEl = document.createElement('div');
        cssGradientEl.innerHTML = "CSS linear-gradient";
        mixin( cssGradientEl.style, {
            width: '200px',
            height: '75px',
            position: 'absolute',
            boxShadow: '4px 4px 8px rgba(0,0,0,0.5)',
            top: '40px',
            left: '20px',
            paddingLeft: "4px",
            border: '4px solid white',
            color: 'black',
            fontWeight: 'bold',
            fontSize: '14px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            color: 'white'
        });

        //sort the gradient's points by their position
        posComparator = function(a,b){
            return internals.numberComparator(a.getPosition(),b.getPosition());
        };

        drawOnCanvas = function(){
            var imageData = ctx.createImageData(canvas.width,1);
            //calculating the gradient will generate a `toxi.color.ColorList`
            //a ColorList has a `colors` array of `toxi.color.TColor`
            var list = gradient.calcGradient(0,canvas.width);
            for( var i=0, l = list.size(); i<l; i++ ){
                //#### TColor#toRGBADecimalArray( [rgba], [startIndex] ):Array
                //optionally provide with an array and an index, the RGBA values
                //fill in the single ImageData typed-array.
                list.colors[i].toRGBADecimalArray(imageData.data, 4*i);
            }
            ctx.putImageData(imageData,0,0);
        };

        //anytime things change
        //
        // - sort the gradient points by position
        // - render to css background
        // - draw the pixel data to the canvas
        exports.render = function(){
            gradient.getGradientPoints().sort(posComparator);
            cssGradientEl.style.backgroundImage = toLinearGradientCSS( gradient, canvas.width );
            drawOnCanvas();
        };

        container.appendChild( canvas );
        container.appendChild( cssGradientEl );

        //expose these for the gui
        exports.range = range;
        exports.gradient = gradient;
        exports.render();

        return exports;
    };

    //calculate the string for a css linear-gradient, given a ColorGradient
    //given a `toxi.color.ColorGradient`, a pixel `width` and optionally an `angle`
    //return the string for the gradient, example:
    //
    //```
    //    toLinearGradientCSS( gradient, canvas.width )
    //    //=> `"-webkit-linear-gradient(left, rgba(46,201,234,1) 0%,rgba(255,84,50,1) 35%,rgba(255,195,50,1) 60%)"`
    //```
    toLinearGradientCSS = function( grad, width, angle ){
        angle = angle || "left";
        var stops = [];
        //ColorGradient#getGradientPoints() returns an array of GradientPoint's
        //getColor() will return the TColor and getPosition() returns the assigned position
        each(grad.getGradientPoints(), function(gradPoint){
            stops.push(gradPoint.getColor().toRGBACSS() +' '+Math.round((gradPoint.getPosition()/width)*100)+'%');
        });

        return '-'+prefix+'-linear-gradient(' +angle+ ', ' +stops.toString()+ ')';
    };

    //build the DatGui interface in the upper-right
    buildGui = function( app ){
        var exports = {},
            gui = new DatGui(),
            addGradientPoint,
            createUI;

        //add a new color-stop on the gradient at the calculated position
        //and return the created gradient-point
        addGradientPoint = function(){
            app.gradient.addColorAt(Math.floor(Math.random()*255), TColor.newRandom());
            return last(app.gradient.getGradientPoints());
        };
        //create the GUI interface for a color in the gradient
        createUI = (function(){
            var i = 0;
            return function(gradPoint){
                var folder = gui.addFolder('Color '+((i++)+1));
                addTColor(folder,gradPoint,'color').onChange(app.onChange);
                folder.add(gradPoint.getColor(),'_alpha',0,1.0).step(0.01).name('alpha').onChange(app.onChange);
                folder.add(gradPoint,'pos',app.range.getAt(0),app.range.getAt(1)).name('pixel pos').onChange(app.onChange);
                folder.open();
            };
        })();


        exports.addColor = function(){
            createUI( addGradientPoint() );
            app.onChange();
        };
        gui.add( exports, 'addColor' ).name('Add A Color');
        //add any possible pre-exisitng colors
        each(app.gradient.getGradientPoints(), createUI);
        return exports;
    };


    return function(){
        var sketch = createGradient();
        buildGui({
            gradient: sketch.gradient,
            range: sketch.range,
            onChange: sketch.render
        });
    };
});
